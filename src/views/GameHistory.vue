<!-- client/src/components/GameHistory.vue -->

<template>
  <div class="game-history">
    <button type="button"
      class="btn btn-secondary btn-sm"
      @click="backToGames">Back to Games</button>
    <vue-csv-downloader type="button"
      class="btn btn-secondary btn-sm"
      :data="csvData"
      :fields="csvFields"
    >Download CSV
    </vue-csv-downloader>
    <div class="bs-component">
      <ul class="list-group">
        <li class="list-group-item"
          @click="routeToPoint(1, gameId + (points.length+1)/100)">
          + (new point)
        </li>
        <li v-for="(point, index) in points.slice().reverse()"
          @click="routeToPoint(0, point.id)" :key="point.id" class="list-group-item">
          <p class="d-flex justify-content-start align-items-center">
          <span v-if="point.scored_by" :style="{color: point.scored_by.color}">
            <span class="name">{{ point.scored_by.name }}</span>
            {{ holds[index-(1-lastPointScored)] ? 'Hold' : 'Break' }}
          </span>
          <span v-if="point.scored_by" class="badge badge-pill ml-auto"
          :class="{'badge-primary': holds[index-(1-lastPointScored)],
                    'badge-secondary': !holds[index-(1-lastPointScored)]}">
            <span v-for="(value, key, index) in score[index-(1-lastPointScored)]" :key="key">
              <span v-if="index === 0">{{ key }}&nbsp;</span>
              <span>{{ value }}</span>
              <span v-if="index === 0">&nbsp;-&nbsp;</span>
              <span v-if="index === 1">&nbsp;{{ key }}</span>
            </span>
          </span>
          </p>
          <small v-for="(team, index) in teams" :key="team.id">
            <span>{{ team.name }}:&nbsp;</span>
          <span v-for="(player, index) in point.players[team.id]" :key="player.id">
            <span>{{ player.lastName }}</span>
            <span v-if="index+1 < point.players[team.id].length">,&nbsp;</span>
          </span>
          <span v-if="index+1 < teams.length">&nbsp;&nbsp;|&nbsp;&nbsp;</span>
          </small>
        </li>
      </ul>
      <div>
        <span>Pulling to Start:</span>
        <div class="btn-group btn-group-toggle" data-toggle="buttons">
          <label v-for="team in teams" :key="team.id"
            class="btn btn-sm btn-secondary name"
            :class="{active: pullingToStart === team.id}">
            <input type="radio" :value="team.id" v-model="pullingToStart"> {{ team.name }}
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gStore from '@/services/gStore';
import moment from '../../node_modules/moment';
import VueCsvDownloader from 'vue-csv-downloader';

export default {
  name: 'GameHistory',
  components: {
    VueCsvDownloader,
  },
  props: {
    gameId: {
      type: Number,
      required: true,
      default: () => 881417,
    },
  },
  data() {
    return {
      teams: [],
      points: [],
      pullingToStart: 0,
    };
  },
  computed: {
    holds: function calcHolds() {
      const h = [];
      const pt = [];
      this.points.forEach((p) => {
        if (p.scored_by) pt.push(p);
      });
      pt.forEach((point, index) => {
        const defenseId = index === 0 ? this.pullingToStart : this.points[index - 1].scored_by.id;
        h.unshift(defenseId === point.scored_by.id ? 0 : 1);
      });
      return h;
    },
    score: function calcScore() {
      const s = [];
      const acc = {};
      acc[this.teams[0].name] = 0;
      acc[this.teams[1].name] = 0;
      const pt = [];
      this.points.forEach((p) => {
        if (p.scored_by) pt.push(p);
      });
      pt.forEach((point) => {
        if (typeof acc[point.scored_by.name] === 'undefined') {
          acc[point.scored_by.name] = 1;
        } else {
          acc[point.scored_by.name] += 1;
        }
        s.unshift(Object.assign({}, acc));
      });
      return s;
    },
    lastPointScored: function lastPointScored() {
      if (this.points[this.points.length - 1].scored_by) return 1;
      return 0;
    },
    csvData: function generateCsvData() {
      let playerArray = [];
      let teamArray = [];
      const ptPlayers = [];
      this.teams.forEach((team) => {
        team.roster.map(p => playerArray.push(p));
      });
      this.points.forEach((pt) => {
        const players = [];
        Object.values(pt.players).forEach((pList) => {
          pList.forEach((player) => {
            players.push(player);
          });
        });
        ptPlayers.push(players);
      });
      playerArray = playerArray.map((_p) => {
        const p = Object.assign({}, _p);
        ptPlayers.forEach((ptP, i) => {
          const point = i + 1;
          if (ptP.map(x => x.id).indexOf(p.id) >= 0) p[point] = 1;
          else p[point] = '';
          p.name = `${p.firstName} ${p.lastName}`;
        });
        return p;
      });
      teamArray = this.teams.map((_t) => {
        const t = Object.assign({}, _t);
        this.points.forEach((pt, i) => {
          const point = i + 1;
          if (pt.scored_by) {
            if (pt.scored_by.id === t.id) t[point] = this.holds.slice().reverse()[i] ? 'H' : 'B';
            else t[point] = '';
          }
        });
        return t;
      });
      return playerArray.concat(teamArray);
    },
    csvFields: function generateCsvFields() {
      const fields = [
        {
          label: 'Name',
          value: 'name',
        },
      ];
      this.points.forEach((pt, i) => {
        const field = {
          label: `Point ${i + 1}`,
          value: `${i + 1}`,
          default: '',
        };
        fields.push(field);
      });
      return fields;
    },
  },
  watch: {
    pullingToStart() { this.updatePulling(this.gameId, this.pullingToStart); },
  },
  created() {
    this.getGameHistory(this.gameId);
  },
  methods: {
    backToGames() {
      this.$router.push({
        name: 'Games',
      });
    },
    async routeToPoint(create, pointId) {
      try {
        if (create) await gStore.createPoint(pointId, this.gameId, moment().utc().format());
        this.$router.push({
          name: 'Point',
          params: {
            pointId,
          },
        });
      } catch (e) {
        // console.error(e);
      }
    },
    async getGameHistory(gameId) {
      try {
        const response = await gStore.fetchGameHistory(gameId);
        this.teams = response.data.data.Game[0].teams;
        this.pullingToStart = response.data.data.Game[0].pullingId
          ? response.data.data.Game[0].pullingId : -1;
        let { points } = response.data.data.Game[0];
        points.sort((a, b) => a.id - b.id);
        points = points.map((_point) => {
          const point = Object.assign({}, _point);
          const t = {};
          this.teams.forEach((team) => {
            const playerArray = [];
            point.players.forEach((player) => {
              if (player.teams.map(pTeam => pTeam.id).indexOf(team.id) >= 0) {
                playerArray.push(player);
              }
            });
            playerArray.sort(this.playerSort);
            t[team.id] = playerArray;
          });
          point.players = t;
          return point;
        });
        this.points = points;
      } catch (e) {
        // console.error(e);
      }
    },
    async updatePulling(gameId, pullingId) {
      try {
        await gStore.updatePulling(gameId, pullingId);
      } catch (e) {
        // console.error(e);
      }
    },
    playerSort(a, b) {
      if (a.gender < b.gender) return -1;
      if (a.gender > b.gender) return 1;
      if (a.lastName < b.lastName) return -1;
      if (a.lastName > b.lastName) return 1;
      if (a.firstName < b.firstName) return -1;
      if (a.firstName > b.firstName) return 1;
      return 0;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

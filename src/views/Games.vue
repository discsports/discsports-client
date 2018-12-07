<template>
  <div class="games">
    <h1 class="text-center">Select a Game</h1>
    <div class="text-center">
      <button v-for="game in gameData" :key="game.id" class="btn btn-primary"
      @click="selectGame(game.id)">
        <p>{{ game.time.format('MMM Do, hh:mm') }}</p>
        <p class="name" :style="{color: game.teams[0].color}">{{ game.teams[0].name }}</p>
        <p>VS</p>
        <p class="name" :style="{color: game.teams[1].color}">{{ game.teams[1].name }}</p></button>
    </div>
  </div>
</template>

<script>
import gStore from '@/services/gStore';
import moment from '../../node_modules/moment';

export default {
  name: 'Games',
  data() {
    return {
      gameData: {},
    };
  },
  created() {
    this.getGames();
  },
  methods: {
    selectGame(gameId) {
      this.$router.push({
        name: 'GameHistory',
        params: {
          gameId,
        },
      });
    },
    async getGames() {
      try {
        const response = await gStore.fetchGames();
        let { games } = response.data.data.Event[0];
        games = games.map((_game) => {
          const game = Object.assign({}, _game);
          game.time = moment(game.time.split('[')[0]);
          return game;
        });
        games.sort((a, b) => a.time - b.time);
        this.gameData = games;
      } catch (e) {
        console.error(e);
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>

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
  mounted() {
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
        this.gameData = response.data.data.Event[0].games;
        this.gameData.forEach((game) => { game.time = moment(game.time.split('[')[0]); });
        this.gameData.sort((a, b) => a.time - b.time);
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

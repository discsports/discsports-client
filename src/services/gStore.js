import api from '@/services/api';

export default {
  fetchGames() {
    return api().post('/graphql', {
      query: `
      {
        Event(name:"2018 Fall League") {
          id
          name
          games {
            id
            time
            teams {
              id
              name
              color
            }
          }
        }
      }`,
    });
  },
  fetchRosters(pointId) {
    return api().post('/graphql', {
      query: `
      query ($pId: Float!) {
  Point(id: $pId) {
    players {
      id
    }
    scored_by {
      id
    }
    game {
      id
      teams {
        id
        name
        color
        roster {
          id
          firstName
          lastName
          gender
        }
      }
      points {
        id
        scored_by {
          id
          name
        }
      }
    }
  }
}`,
      variables: { pId: pointId },
    });
  },
  createPoint(pointId, gameId, time) {
    return api().post('/graphql', {
      query: `
      mutation ($pointId: Float!, $gameId: Int!, $time: String) {
        CreatePoint(id: $pointId, time: $time) {
          id
          time
        }
        AddPointGame(pointid: $pointId, gameid: $gameId) {
          id
          game {
            id
          }
        }
      }`,
      variables: { pointId, gameId, time },
    });
  },
  updatePoint(pointId, teamId) {
    return api().post('/graphql', {
      query: `
      mutation ($pointId: Float!, $teamId: Int!) {
        AddTeamPoints(teamid: $teamId, pointid: $pointId) {
          id
          name
          points {
            id
          }
        }
      }`,
      variables: { pointId, teamId },
    });
  },
  removePoint(pointId, teamId) {
    return api().post('/graphql', {
      query: `
      mutation ($pointId: Float!, $teamId: Int!) {
        RemoveTeamPoints(teamid: $teamId, pointid: $pointId) {
          id
          name
          points {
            id
          }
        }
      }`,
      variables: { pointId, teamId },
    });
  },
  enrollPoint(pointId, playerId) {
    return api().post('/graphql', {
      query: `
      mutation ($pointId: Float!, $playerId: Int!) {
        AddPlayerPoints(playerid: $playerId, pointid: $pointId) {
          id
          points {
            id
          }
        }
      }`,
      variables: { pointId, playerId },
    });
  },
  unEnrollPoint(pointId, playerId) {
    return api().post('/graphql', {
      query: `
      mutation ($pointId: Float!, $playerId: Int!) {
        RemovePlayerPoints(playerid: $playerId, pointid: $pointId) {
          id
          points {
            id
          }
        }
      }`,
      variables: { pointId, playerId },
    });
  },
  fetchGameHistory(gameId) {
    return api().post('/graphql', {
      query: `
        query ($gId: Int) {
          Game(id: $gId) {
            id
            pullingId
            teams {
              id
              name
            }
            points {
              id
              time
              scored_by {
                id
                name
                color
              }
              players {
                id
                firstName
                lastName
                teams {
                  id
                }
              }
            }
          }
        }`,
      variables: { gId: gameId },
    });
  },
  updatePulling(gameId, pullingId) {
    return api().post('/graphql', {
      query: `
      mutation ($gameId: Int!, $pullingId: Int!) {
        UpdateGame(id: $gameId, pullingId: $pullingId) {
          id
          pullingId
        }
      }`,
      variables: { gameId, pullingId },
    });
  },
};

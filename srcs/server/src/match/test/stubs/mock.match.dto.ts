import { CreateMatchDto } from 'src/match/dto/create-match.dto';

// Match data
function createMockMatchesDto(idP1: number, idP2: number): CreateMatchDto[] {
  const mockMatchesDto: CreateMatchDto[] = [];
  // [0] Ok match
  mockMatchesDto.push({
    players: [
      {
        playerId: idP1,
        score: 9,
        side: 0,
        status: 0,
      },
      {
        playerId: idP2,
        score: 2,
        side: 1,
        status: 1,
      },
    ],
  });
  // [1] Only One player
  mockMatchesDto.push({
    players: [
      {
        playerId: idP1,
        score: 9,
        side: 0,
        status: 0,
      },
    ],
  });
  // [2] Two players, one wrong id
  mockMatchesDto.push({
    players: [
      {
        playerId: 666,
        score: 9,
        side: 0,
        status: 0,
      },
      {
        playerId: idP2,
        score: 2,
        side: 1,
        status: 1,
      },
    ],
  });
  // [3] two players, same side
  mockMatchesDto.push({
    players: [
      {
        playerId: idP1,
        score: 9,
        side: 0,
        status: 0,
      },
      {
        playerId: idP2,
        score: 2,
        side: 0,
        status: 1,
      },
    ],
  });
  // [4] two players, same status (2 wins)
  mockMatchesDto.push({
    players: [
      {
        playerId: idP1,
        score: 9,
        side: 0,
        status: 0,
      },
      {
        playerId: idP2,
        score: 2,
        side: 1,
        status: 0,
      },
    ],
  });
  // [5] two players, same status (2 losses)
  mockMatchesDto.push({
    players: [
      {
        playerId: idP1,
        score: 9,
        side: 0,
        status: 1,
      },
      {
        playerId: idP2,
        score: 2,
        side: 1,
        status: 1,
      },
    ],
  });
  // [6] two players, wrong status
  mockMatchesDto.push({
    players: [
      {
        playerId: idP1,
        score: 9,
        side: 0,
        status: 8,
      },
      {
        playerId: idP2,
        score: 2,
        side: 1,
        status: 1,
      },
    ],
  });
  return mockMatchesDto;
}

export { createMockMatchesDto };

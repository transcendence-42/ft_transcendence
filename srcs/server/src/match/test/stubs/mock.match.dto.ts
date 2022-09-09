import { UpdateMatchDto } from 'src/match/dto/update-match.dto';
import { UpdateScoresDto } from 'src/match/dto/update-scores.dto';

// Match data
const matchData = [{ status: 0 }, { status: 1 }, { status: 2 }];

const mockMatchUpdateDto: UpdateMatchDto[] = [];
matchData.forEach((match) => {
  mockMatchUpdateDto.push({ status: match.status });
});

// Score data
function createMockScoresDto(idP1: number, idP2: number): UpdateScoresDto[] {
  const mockScoresDto: Array<UpdateScoresDto> = [];
  // [0] Update 2 scores
  mockScoresDto.push({
    players: [
      {
        playerId: idP1,
        score: 42,
      },
      {
        playerId: idP2,
        score: 38,
      },
    ],
  });
  // [1] Update 1 score
  mockScoresDto.push({
    players: [
      {
        playerId: idP1,
        score: 8,
      },
    ],
  });
  // [2] Update 2 scores with first player unknown
  mockScoresDto.push({
    players: [
      {
        playerId: idP2 + 42,
        score: 42,
      },
      {
        playerId: idP2,
        score: 38,
      },
    ],
  });
  // [3] Update 2 scores with second player unknown
  mockScoresDto.push({
    players: [
      {
        playerId: idP1,
        score: 42,
      },
      {
        playerId: idP2 + 42,
        score: 38,
      },
    ],
  });
  // [4] Update 2 scores with both players unknown
  mockScoresDto.push({
    players: [
      {
        playerId: idP2 + 42,
        score: 42,
      },
      {
        playerId: idP2 + 43,
        score: 38,
      },
    ],
  });
  return mockScoresDto;
}

export { mockMatchUpdateDto, createMockScoresDto };

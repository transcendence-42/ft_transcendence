import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import PhotoProfilDropdown from '../../Components/Tools/Button/PhotoProfilDropdown'
import WinLose from './WinLose'


export default function MatchHistory(props : any) {

	// OFFLINE TEST

	let test = [
		{
			"id": 4,  // ID du match
			"date": "2022-09-16T15:39:56.460Z",
			"players": [
			  {
				"username":"Florian",
				"matchId": 4,
				"playerId": 1,
				"side": 0,
				"score": 9,
				"status": 1
			  },
			  {
				"username":"GrosGégé",
				"matchId": 4,
				"playerId": 2,
				"side": 1,
				"score": 7,
				"status": 0
			  }
			]
		},
		{
			"id": 5,  // ID du match
			"date": "2022-09-16T15:39:56.460Z",
			"players": [
			  {
				"username":"Michel",
				"matchId": 5,
				"playerId": 8,
				"side": 0,
				"score": 2,
				"status": 0
			  },
			  {
				"username":"Florian",
				"matchId": 4,
				"playerId": 1,
				"side": 1,
				"score": 0,
				"status": 0
			  }
			]
		},
		{
			"id": 6,  // ID du match
			"date": "2022-09-16T15:39:56.460Z",
			"players": [
			  {
				"username":"Florian",
				"matchId": 6,
				"playerId": 1,
				"side": 0,
				"score": 2,
				"status": 0
			  },
			  {
				"username":"Florian",
				"matchId": 6,
				"playerId": 2,
				"side": 1,
				"score": 0,
				"status": 1
			  },

			]
		},
		{
			"id": 6,  // ID du match
			"date": "2022-09-16T15:39:56.460Z",
			"players": [
			  {
				"username":"Florian",
				"matchId": 6,
				"playerId": 1,
				"side": 0,
				"score": 2,
				"status": 0
			  },
			  {
				"username":"Florian",
				"matchId": 6,
				"playerId": 2,
				"side": 1,
				"score": 0,
				"status": 1
			  },

			]
		},
		{
			"id": 6,  // ID du match
			"date": "2022-09-16T15:39:56.460Z",
			"players": [
			  {
				"username":"Florian",
				"matchId": 6,
				"playerId": 1,
				"side": 0,
				"score": 2,
				"status": 0
			  },
			  {
				"username":"Florian",
				"matchId": 6,
				"playerId": 2,
				"side": 1,
				"score": 0,
				"status": 1
			  },

			]
		},
		{
			"id": 6,  // ID du match
			"date": "2022-09-16T15:39:56.460Z",
			"players": [
			  {
				"username":"Florian",
				"matchId": 6,
				"playerId": 1,
				"side": 0,
				"score": 2,
				"status": 0
			  },
			  {
				"username":"Florian",
				"matchId": 6,
				"playerId": 2,
				"side": 1,
				"score": 0,
				"status": 1
			  },

			]
		},
	  ]

	// if (!props.matchesList.lenght)
	// {
	// 	return (
	// 		<div className="blueBoxMatch"
	// 		style={{
	// 				width: "100%",
	// 				height: "100%",
	// 			}}>
	// 			<div className="yellowText" style={{fontSize: "3vw"}}> Matches History </div>
	// 			<div className="blueTextMatch" style={{fontSize: "2vw", marginTop:"3vh"}}> Play a Game first</div>
	// 		</div>
	// 		 );
	// }
	// else
	// {
	return (
		<div className="blueBoxMatch"
		style={{
				width: "100%",
				height: "100%",
			}}>
			<div className="pinkText" style={{fontSize: "3vw"}}> Matches History </div>
			<table className="table  scroll m-1 align-middle  ">
				<tbody>
					{test.map((matches: any, index: number) =>(
					index < 10 &&
					<tr key={index} style={{fontSize: "2vw"}}>
						<td> <PhotoProfilDropdown
								url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"}
								width={"4vw"}
								height={"4vw"}/>
						</td>
						<td colSpan={2}>
							<table>
								<tbody>
									<tr>
										<td>{matches.players[0].username}</td>
									</tr>
									<tr>
										<td>{matches.players[0].score}</td>
									</tr>
								</tbody>
							</table>
						</td>
						<td className="pinkText" > VS </td>
						<td colSpan={2} >
							<table>
								<tbody>
									<tr>
										<td>{matches.players[1].username}</td>
									</tr>
									<tr>
										<td>{matches.players[1].score}</td>
									</tr>
								</tbody>
							</table>
						</td>
						<td> <PhotoProfilDropdown
								url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"}
								width={"4vw"}
								height={"4vw"}/>
						</td>
						<td> <WinLose size={"2vw"} id={props.id} players={matches.players}/></td>
					</tr>
					))}
				</tbody>
			</table>
		</div>
 		);
	}
// }



// {props.matchesList.map((matches: any, index: number) =>(

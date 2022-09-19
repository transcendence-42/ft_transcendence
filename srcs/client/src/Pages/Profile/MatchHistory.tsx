import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import PhotoProfil from './PhotoProfil'


export default function MatchHistory(props : any) {


	let test = [
		{
			"id": 4,  // ID du match
			"date": "2022-09-16T15:39:56.460Z",
			"players": [
			  {
				"username":"Michel",
				"matchId": 4,
				"playerId": 1,
				"side": 0,
				"score": 2,
				"status": 0
			  },
			  {
				"username":"Gros gege",
				"matchId": 4,
				"playerId": 2,
				"side": 1,
				"score": 7,
				"status": 1
			  }
			]
		},
		{
			"id": 5,  // ID du match
			"date": "2022-09-16T15:39:56.460Z",
			"players": [
			  {
				"username":"Florian",
				"matchId": 5,
				"playerId": 1,
				"side": 0,
				"score": 2,
				"status": 0
			  },
			  {
				"username":"Michel",
				"matchId": 5,
				"playerId": 2,
				"side": 1,
				"score": 0,
				"status": 1
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
			  }
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
			<div className="yellowText" style={{fontSize: "3vw"}}> Matches History </div>
			<table className="scrollBox" style={{alignItems: "flex-start"}} >
				<tbody>
					{test.map((matches: any, index: number) =>(
					<tr key={index} className="blueTextMatch" style={{fontSize: "2vw"}}>
						{
						<>
						<td> <PhotoProfil url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"} width={"4vw"} height={"4vw"}/></td>
						<td style={{marginRight: "2vw", display:"flex", justifyContent:"flex-start", alignContent:"center" }}>
							{matches.players[0].username} {matches.players[0].score}
						</td>
						<td style={{marginLeft: "1.5vw" }}> VS </td>
						<td style={{marginRight: "2vw", display:"flex", justifyContent:"flex-start", alignContent:"center" }}>
							{matches.players[1].username} {matches.players[1].score}
						</td>
						<td> <PhotoProfil url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"} width={"4vw"} height={"4vw"}/></td>
						<td style={{marginRight: "2vw", display:"flex", justifyContent:"flex-start", alignContent:"center" }}> WIN </td>
						</>
						}
					</tr>
					))}
				</tbody>
			</table>
		</div>
 		);
}


// return (
// 	<div className="blueBoxMatch"
// 	style={{
// 			width: "100%",
// 			height: "100%",
// 		}}>
// 		<div className="yellowText" style={{fontSize: "3vw"}}> Matches History </div>
// 		<table className="scrollBox" style={{alignItems: "flex-start"}} >
// 			<tbody>
// 				{props.matchesList.map((matches: any, index: number) =>(
// 				<tr key={index} className="blueTextMatch" style={{fontSize: "2vw"}}>
// 					{
// 					<>
// 					<td> <PhotoProfil url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"} width={"4vw"} height={"4vw"}/></td>
// 					<td style={{marginRight: "2vw", display:"flex", justifyContent:"flex-start", alignContent:"center" }}> Francoise 0 </td>
// 					<td style={{marginLeft: "1.5vw" }}> VS </td>
// 					<td style={{marginRight: "2vw", display:"flex", justifyContent:"flex-start", alignContent:"center" }}> Florian 5 </td>
// 					<td> <PhotoProfil url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"} width={"4vw"} height={"4vw"}/></td>
// 					</>
// 					}
// 				</tr>
// 				))}
// 			</tbody>
// 		</table>
// 	</div>
// 	 );
// }

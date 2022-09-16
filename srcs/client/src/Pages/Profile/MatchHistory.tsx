import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import PhotoProfil from './PhotoProfil'


export default function MatchHistory(props : any) {

	if (props.matchesList.lenght === 0)
	{
		return (
			<div className="blueBoxMatch"
			style={{
					width: "100%",
					height: "100%",
				}}>
				<div className="yellowText" style={{fontSize: "3vw"}}> Matches History </div>
				<div className="blueTextMatch" style={{fontSize: "2vw", marginTop:"3vh"}}> Play a Game first</div>
			</div>
			 );
	}
	else
	{
	return (
		<div className="blueBoxMatch"
		style={{
				width: "100%",
				height: "100%",
			}}>
			<div className="yellowText" style={{fontSize: "3vw"}}> Matches History </div>
			<table className="scrollBox" style={{alignItems: "flex-start"}} >
				<tbody>
					{props.matchesList.map((matches: any, index: number) =>(
					<tr key={index} className="blueTextMatch" style={{fontSize: "2vw"}}>
						{
						<>
						<td> <PhotoProfil url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"} width={"4vw"} height={"4vw"}/></td>
						<td style={{marginRight: "2vw", display:"flex", justifyContent:"flex-start", alignContent:"center" }}> Francoise 0 </td>
						<td style={{marginLeft: "1.5vw" }}> VS </td>
						<td style={{marginRight: "2vw", display:"flex", justifyContent:"flex-start", alignContent:"center" }}> Florian 5 </td>
						<td> <PhotoProfil url={"https://cdn.intra.42.fr/users/fmonbeig.jpg"} width={"4vw"} height={"4vw"}/></td>
						</>
						}
					</tr>
					))}
				</tbody>
			</table>
		</div>
 		);
	}
}

// return (
// 	<div className="blueBoxFriend"
// 	style={{
// 	 width: "100%",
// 	 height: "100%",
// 	}}>
// 		<div className="yellowText" style={{fontSize: "3vw"}}> Friends </div>
// 			{ props.friends ?
// 			<table className="scrollBox" style={{alignItems: "flex-start"}} >
// 				<tbody>
// 					{props.friendList.map((friends: any, index: number) =>(
// 					<tr key={index} className="blueTextMatch" style={{fontSize: "2vw"}}>
// 						{
// 						<>
// 						<td> <PhotoProfil url={friends.profilePicture} width={"4vw"} height={"4vw"}/></td>
// 						<td style={{marginRight: "2vw" }}> {friends.username} </td>
// 						<td style={{marginRight: "2vw"}}> <OnlineOffline status={friends.currentStatus} size={"2vw"}/> </td>
// 						</>
// 						}
// 					</tr>
// 					))}
// 				</tbody>
// 			</table>
// 				:
// 				<div className="blueTextMatch" style={{fontSize: "2vw", marginTop:"3vh"}}> New Friends awaits you</div>
// 				}
// 	</div>
// 	 );

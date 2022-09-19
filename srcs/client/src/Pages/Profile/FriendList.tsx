import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import "./profile.css"
import PhotoProfil from './PhotoProfil'
import OnlineOffline from './OnlineOffline'


export default function FriendList(props : any) {

	let test = [
		{
		  "username": "Flmastor",
		  "profilePicture": "https://cdn.intra.42.fr/users/flmastor.jpg",
		  "currentStatus": 0,
		  "eloRating": 0},
		{
		  "username": "Flal",
		  "profilePicture": "https://cdn.intra.42.fr/users/fmonbeig.jpg",
		  "currentStatus": 1,
		  "eloRating": 0},
		  {
			"username": "Johny",
			"profilePicture": "https://cdn.intra.42.fr/users/fmonbeig.jpg",
			"currentStatus": 0,
			"eloRating": 0}
	  ];

	return (
		<div className="blueBoxFriend"
		style={{
		 width: "100%",
		 height: "100%",
		}}>
			<div className="yellowText" style={{fontSize: "3vw"}}> Friends </div>
				{
				<table className="scrollBox" style={{alignItems: "flex-start"}} >
					<tbody>
						{test.map((friends: any, index: number) =>(
						<tr key={index} className="blueTextMatch" style={{fontSize: "2vw"}}>
							{
							<>
							<td> <PhotoProfil url={friends.profilePicture} width={"4vw"} height={"4vw"}/></td>
							<td style={{marginRight: "2vw" }}> {friends.username} </td>
							<td style={{marginRight: "2vw"}}> <OnlineOffline status={friends.currentStatus} size={"2vw"}/> </td>
							</>
							}
						</tr>
						))}
					</tbody>
				</table>
					}
		</div>
 		);
}
// 	return (
// 		<div className="blueBoxFriend"
// 		style={{
// 		 width: "100%",
// 		 height: "100%",
// 		}}>
// 			<div className="yellowText" style={{fontSize: "3vw"}}> Friends </div>
// 				{ props.friends ?
// 				<table className="scrollBox" style={{alignItems: "flex-start"}} >
// 					<tbody>
// 						{props.friendList.map((friends: any, index: number) =>(
// 						<tr key={index} className="blueTextMatch" style={{fontSize: "2vw"}}>
// 							{
// 							<>
// 							<td> <PhotoProfil url={friends.profilePicture} width={"4vw"} height={"4vw"}/></td>
// 							<td style={{marginRight: "2vw" }}> {friends.username} </td>
// 							<td style={{marginRight: "2vw"}}> <OnlineOffline status={friends.currentStatus} size={"2vw"}/> </td>
// 							</>
// 							}
// 						</tr>
// 						))}
// 					</tbody>
// 				</table>
// 					:
// 					<div className="blueTextMatch" style={{fontSize: "2vw", marginTop:"3vh"}}> New Friends awaits you</div>
// 					}
// 		</div>
//  		);
// }



// let test = [
// 	{
// 	  "id": 0,
// 	  "username": "string",
// 	  "email": "string",
// 	  "createdAt": "2022-09-19T10:07:38.313Z",
// 	  "profilePicture": "https://cdn.intra.42.fr/users/flmastor.jpg",
// 	  "currentStatus": 0,
// 	  "eloRating": 0,
// 	  "credentials": {
// 		"id": 0,
// 		"email": "string",
// 		"username": "string",
// 		"password": "string",
// 		"user": "string",
// 		"userId": 0,
// 		"twoFactorActivated": true,
// 		"twoFactorSecret": "string"
// 	  }}
//   ];

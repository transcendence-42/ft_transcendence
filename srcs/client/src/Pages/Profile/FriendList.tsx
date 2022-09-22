import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import "./profile.css"
import PhotoProfilDropdown from '../../Components/Tools/Button/PhotoProfilDropdown'
import OnlineOffline from './OnlineOffline'
import FriendshipRejected from './Button/FriendshipRejected'
import FriendshipAccepted from './Button/FriendshipAccepted'


export default function FriendList(props : any) {

	let test_friends = [
		{
		  "id": 2,
		  "username": "Flmastor",
		  "profilePicture": "https://cdn.intra.42.fr/users/flmastor.jpg",
		  "currentStatus": 0,
		  "eloRating": 0},
		{
		  "id": 3,
		  "username": "Flal",
		  "profilePicture": "https://cdn.intra.42.fr/users/fmonbeig.jpg",
		  "currentStatus": 1,
		  "eloRating": 0},
		  {
			"id": 1,
			"username": "Johny",
			"profilePicture": "https://cdn.intra.42.fr/users/fmonbeig.jpg",
			"currentStatus": 0,
			"eloRating": 0}
	  ];

	let test_requested = [
		{
		  "id": 2,
		  "username": "Flmastor",
		  "profilePicture": "https://cdn.intra.42.fr/users/flmastor.jpg",
		  "currentStatus": 0,
		  "eloRating": 0},
		{
		  "id": 3,
		  "username": "Flal",
		  "profilePicture": "https://cdn.intra.42.fr/users/fmonbeig.jpg",
		  "currentStatus": 1,
		  "eloRating": 0},
		  {
			"id": 1,
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
				{<table className="table  scroll m-1 align-middle  ">
					<tbody>
						{ test_requested &&
						test_requested.map((friends: any, index: number) =>(
						<tr key={index} style={{fontSize: "2vw"}}>
							{
							<>
								<td className="pinkText"> New  </td>
								<td> <PhotoProfilDropdown url={friends.profilePicture} id={friends.id} originalId={props.originalId} width={"4vw"} height={"4vw"}/></td>
								<td> {friends.username} </td>
								<td> <FriendshipAccepted id={friends.id} originalId={props.originalId}/></td>
								<td> <FriendshipRejected id={friends.id} originalId={props.originalId}/></td>
							</>
							}
						</tr>
						))}
						{ test_friends ?
						test_friends.map((friends: any, index: number) =>(
						<tr key={index} style={{fontSize: "2vw"}}>
							{
							<>
								<td> <PhotoProfilDropdown url={friends.profilePicture} id={friends.id} originalId={props.originalId} width={"4vw"} height={"4vw"}/></td>
								<td> {friends.username} </td>
								<td> <OnlineOffline status={friends.currentStatus} size={"2vw"}/> </td>
							</>
							}
						</tr>
						))
						:<tr>
							<td className="blueTextMatch" style={{fontSize: "2vw", marginTop:"3vh"}}> New Friends awaits you</td>
						</tr>
						}
					</tbody>
				</table>
				}
		</div>
 		);
}

// FriendList bis avec les requested friend avec les meme elements que friend
// On va creer une liste en dessous avec les Friends qui sont requested
// + Bouton pour accepter la demande

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
					// :
					// <div className="blueTextMatch" style={{fontSize: "2vw", marginTop:"3vh"}}> New Friends awaits you</div>
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

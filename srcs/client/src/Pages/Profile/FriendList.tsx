import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import "./profile.css"
import PhotoProfilDropdown from '../../Components/Tools/Button/PhotoProfilDropdown'
import OnlineOffline from './OnlineOffline'
import FriendshipRejected from './Button/FriendshipRejected'
import FriendshipAccepted from './Button/FriendshipAccepted'


export default function FriendList(props : any) {

	// OFFLINE TEST

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
				{<table className="table scroll m-1 align-middle  ">
					<tbody>
						{ test_requested &&
						test_requested.map((friends: any, index: number) =>(
						<tr key={index} style={{fontSize: "2vw"}}>
							{
							<>
								<td className="pinkText"> New  </td>
								<td> <PhotoProfilDropdown
										url={friends.profilePicture}
										id={friends.id}
										originalId={props.originalId}
										width={"4vw"}
										height={"4vw"}/>
								</td>
								<td> {friends.username} </td>
								<td colSpan={2} >
								<table>
									<tbody>
										<tr>
											<td> <FriendshipAccepted
													id={friends.id}
													originalId={props.originalId}
													up ={props.up}/>
											</td>
										</tr>
										<tr>
											<td> <FriendshipRejected
													id={friends.id}
													originalId={props.originalId}
													up={props.up}/>
											</td>
										</tr>
									</tbody>
								</table>
						</td>
							</>
							}
						</tr>
						))}
						{ test_friends ?
						test_friends.map((friends: any, index: number) =>(
						<tr key={index} style={{fontSize: "2vw"}}>
							{
							<>
								<td> <PhotoProfilDropdown
										url={friends.profilePicture}
										id={friends.id}
										originalId={props.originalId}
										width={"4vw"}
										height={"4vw"}/>
								</td>
								<td> {friends.username} </td>
								<td> <OnlineOffline
										status={friends.currentStatus}
										size={"2vw"}/>
								</td>
							</>
							}
						</tr>
						))
						:<tr>
							<td className="blueTextMatch" style={{fontSize: "2vw", marginTop:"3vh"}}>
								New Friends awaits you
							</td>
						</tr>
						}
					</tbody>
				</table>
				}
		</div>
 		);
}

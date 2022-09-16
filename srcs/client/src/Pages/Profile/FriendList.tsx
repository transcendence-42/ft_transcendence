import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"
import "./profile.css"
import PhotoProfil from './PhotoProfil'
import OnlineOffline from './OnlineOffline'


export default function FriendList(props : any) {

	return (
		<div className="blueBoxFriend"
		style={{
		 width: "100%",
		 height: "100%",
		}}>
			<div className="yellowText" style={{fontSize: "3vw"}}> Friend </div>
				<table className="scrollBox" style={{alignItems: "flex-start"}} >
					<tbody>
						{props.friendList.map((friends: any, index: number) =>(
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
		</div>
 		);
}

//For loop in jsx

{/* <tbody>
    for (var i=0; i < objects.length; i++) {
        <ObjectRow obj={objects[i]} key={i}>
    }
</tbody> */}

//With map in component
{/* <tbody>
    {objects.map(function(object, i){
        return <ObjectRow obj={object} key={i} />;
    })}
</tbody> */}

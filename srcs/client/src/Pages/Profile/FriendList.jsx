import React from 'react'
import "../../Components/Tools/Text.css"
import "../../Components/Tools/Box.css"


export default function FriendList(props) {

	const test = props.friendList.map(x => x.username);
	console.log(test);



	return (
		<div className="blueBoxMatch"
		style={{
		 width: "100%",
		 height: "100%",
		}}>
			<div className="yellowText" style={{fontSize: "3vw"}}> Friend </div>
				<div className="scrollBox" >
					{/* { props.friendList.map((value, index) => {})

					} */}
				<div className="blueTextMatch" style={{fontSize: "2vw"}}>
				 </div>
			</div>
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

import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import ProfileNavbar from "./ProfileNavbar";


class ChatList extends React.Component {
    state={
        user:{},
        loaded:false,
        chats:[],
        renderChats: []
    }

    componentDidMount(){
        axios({
            method: "get",
            url: "https://phobbies-app.herokuapp.com/sv/return-all-chats",
            withCredentials: true
          })
        .then((result) => {
            axios({
                method: "get",
                url: "https://phobbies-app.herokuapp.com/sv/return-user",
                withCredentials: true
              })
            .then((user)=>{
                const stateCopy = {...this.state}
                stateCopy.chats = result.data
                stateCopy.renderChats = result.data
                stateCopy.user = user.data.result
                stateCopy.loaded = true
                this.setState(stateCopy)
            })
        }).catch((err) => {
            console.log(err)
        });
    }

    filterChats(e){
        const {value} = e.target
        const chatsFiltered = this.state.chats.filter((chat, index)=>{
          const friend = chat.participants.filter(participant => participant._id !== this.state.user._id)[0]
          return friend.username.toLowerCase().includes(value.toLowerCase())
        })
        this.setState({...this.state, renderChats: chatsFiltered})
      }

    render(){
        let allChats
        if (this.state.loaded){  
        allChats = this.state.renderChats.map((chat, index)=>{

            const friend = chat.participants.filter(participant => participant._id !== this.state.user._id)[0]

            const unreadMsgs = chat.messages.filter(message=> message.status === "UNREAD" && message.username !== this.state.user.username)

            
            return(
                <Link to={`/chat/${friend._id}`} key={index}>
                    <div className="friend">
                        <img src={friend.photo} alt={friend.username}/>
                        <div>
                            <p><b>Chatting with {friend.username}</b></p>
                            <p>Unread messages: {unreadMsgs.length}</p>
                        </div>
                    </div>
                </Link>
            )
        })}

        return this.state.loaded ? (
            <div className="Chatlist">
                <ProfileNavbar />
                <h1>Chatlist</h1>
                <input type='text' onChange={(e)=>this.filterChats(e)} />
                <div className="chatContainer">
                   {allChats} 
                </div>
            </div>

        ) : (
            <div className="spinner">
                <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
            </div>
        )
    }
}
export default ChatList;
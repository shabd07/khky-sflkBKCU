import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'

export default class BookRequestScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      itemName:"",
      contact:"",
      Condition:"",
      IsBookRequestActive : "",
      donatedItemName: "",
      itemStatus:"",
      donateId:"",
      userDocId: '',
      docId :''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }



  addRequest = async (itemName,reasonToRequest)=>{
    var userId = this.state.userId
    var randomDonatetId = this.createUniqueId()
    db.collection('requested_books').add({
        "user_id": userId,
        "item_name":itemName,
        "Condition":Condition,
        "contact":contact,
        "donate_id"  : randomDonatetId,
        "item_status" : "donated",
         "date"       : firebase.firestore.FieldValue.serverTimestamp()

    })

    await  this.getBookRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      IsBookRequestActive: true
      })
    })
  })

    this.setState({
        itemName :'',
        Condition : '',
        contact:'',
        donateId: randomDonatetId
    })

    return Alert.alert("donation request sent successfully")


  }

receivedBooks=(itemName)=>{
  var userId = this.state.userId
  var donateId = this.state.donateId
  db.collection('received_books').add({
      "user_id": userId,
      "item_name":itemName,
      "conatact":contact,
      "donate_id"  : donateId,
      "itemStatus"  : "donated",

  })
}




getIsBookRequestActive(){
  db.collection('users')
  .where('email_id','==',this.state.userId)
  .onSnapshot(querySnapshot => {
    querySnapshot.forEach(doc => {
      this.setState({
        IsItemDonationActive:doc.data().IsItemDonationActive,
        userDocId : doc.id
      })
    })
  })
}










getItemDonation =()=>{
  // getting the requested book
var itemDonation=  db.collection('doanted_item')
  .where('user_id','==',this.state.userId)
  .get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      if(doc.data().item_status !== "donated"){
        this.setState({
          donateId : doc.data().donate_id,
        doantedItemName: doc.data().item_name,
          itemStatus:doc.data().item_status,
          docId     : doc.id
        })
      }
    })
})}



sendNotification=()=>{
  //to get the first name and last name
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc)=>{
      var name = doc.data().first_name
      var lastName = doc.data().last_name

      // to get the donor id and book nam
      db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
      .then((snapshot)=>{
        snapshot.forEach((doc) => {
          var donorId  = doc.data().donor_id
          var itemName =  doc.data().item_name

          //targert user id is the donor id to send notification to the user
          db.collection('all_notifications').add({
            "targeted_user_id" : donorId,
            "message" : name +" " + lastName + " received the book " + itemName ,
            "notification_status" : "unread",
            "item_name" : itemName
          })
        })
      })
    })
  })
}

componentDidMount(){
  this.getItemDonation()
  this.getIsItemDonationActive()

}

updateItemDonationStatus=()=>{
  //updating the book status after receiving the book
  db.collection('donated_items').doc(this.state.docId)
  .update({
    item_status : 'donated'
  })

  //getting the  doc id to update the users doc
  db.collection('users').where('email_id','==',this.state.userId).get()
  .then((snapshot)=>{
    snapshot.forEach((doc) => {
      //updating the doc
      db.collection('users').doc(doc.id).update({
        IsItemRequestActive: false
      })
    })
  })


}


  render(){

    if(this.state.IsItemRequestActive === true){
      return(

        // Status screen

        <View style = {{flex:1,justifyContent:'center'}}>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text>Item Name</Text>
          <Text>{this.state.donatedItemName}</Text>
          </View>
          <View style={{borderColor:"orange",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
          <Text> Condition </Text>

          <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'orange',backgroundColor:"orange",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateItemStatus();
            this.receivedBooks(this.state.itemName)
          }}>
          <Text>I Received donation successfully</Text>
          </TouchableOpacity>
        </View>
      )
    }
    else
    {
    return(
      // Form screen
        <View style={{flex:1}}>
          <MyHeader title="Donate Item" navigation ={this.props.navigation}/>

          <ScrollView>
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <TextInput
                style ={styles.formTextInput}
                placeholder={"enter item name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.itemName}
              />
              <TextInput
                style ={[styles.formTextInput,{height:300}]}
                multiline
                numberOfLines ={8}
                placeholder={"Condition"}
                onChangeText ={(text)=>{
                    this.setState({
                        Condition:text
                    })
                }}
                value ={this.state.Condition}
              />
               <TextInput
                style ={[styles.formTextInput,{height:300}]}
                keyboardType={"numeric"}
                numberOfLines ={8}
                placeholder={"contact"}
                onChangeText ={(text)=>{
                    this.setState({
                        contact:text
                    })
                }}
                value ={this.state.contact}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{ this.addDonation(this.state.itemName,this.state.Condition,this.state.contact);
                }}
                >
                <Text>Donate</Text>
              </TouchableOpacity>

            </KeyboardAvoidingView>
            </ScrollView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:35,
    alignSelf:'center',
    borderColor:'#ffab91',
    borderRadius:10,
    borderWidth:1,
    marginTop:20,
    padding:10,
  },
  button:{
    width:"75%",
    height:50,
    justifyContent:'center',
    alignItems:'center',
    borderRadius:10,
    backgroundColor:"#ff5722",
    shadowColor: "#000",
    shadowOffset: {
       width: 0,
       height: 8,
    },
    shadowOpacity: 0.44,
    shadowRadius: 10.32,
    elevation: 16,
    marginTop:20
    },
  }
)

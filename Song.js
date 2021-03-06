import React, { Component } from 'react';
import {
  View,Text,StyleSheet,Image,TouchableOpacity,FlatList,Modal,TextInput
} from 'react-native';
import Constants from 'expo-constants';
import { FontAwesome5 } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import * as song from './song.json'
import {connect} from 'react-redux';
import firestore from './firebase/Firestore'
import {addSong,deletedSong,saveSong} from './actions/actionSong'
class Song extends Component {
  constructor(props){
    super(props);
     this.state = {
        showModal:false,
        name:"-",
        singer:"-",
        detail:"-",
        songs:[],
        songID:null,
        popup:false,
        refreshing:false,

    };
  }
  
  
  deleteSongSuccess=()=>{
    console.log("delete Success...")
    let id = {
      id:this.state.songID
    }
    this.props.del(id)
  }
  deleteSongUnsuccess=(error)=>{
      console.log(error)
  }
  onSelected=()=>{
    this.setState({popup:false})
    firestore.deleteSongByID(this.state.songID,this.deleteSongSuccess,this.deleteSongUnsuccess)
    
  }
  renderItem=({item})=>{
    return(
      <View style={{margin:10}}>
        {this.props.type.type=="Admin"?<TouchableOpacity onPress={()=>{
                          this.setState({popup:true}),
                          this.setState({songID:item.id}),
                          this.setState({name:item.name}),
                          this.setState({singer:item.singer}),
                          this.setState({detail:item.detail})
                          }}>
            <View style={styles.songBar}>
                        <View style={{backgroundColor:'#E2E2E2',height:80,width:70,borderRadius:10,margin:10,marginLeft:1,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                            <Image source={{uri:'https://image.flaticon.com/icons/png/512/126/126493.png'}} style={{height:45,width:45}}></Image>
                        </View>
                        <View style={{marginTop:5,marginBottom:5,height:100,width:'75%'}}>
                            <Text style={{color:'black',marginLeft:10,fontSize:16,fontFamily:'kanitSemiBold'}}>{"เพลง: "+item.name}</Text>
                            <Text style={{color:'#8B8B8B',marginLeft:10,marginTop:5,fontSize:15,fontFamily:'kanitSemiBold'}}>{"ศิลปิน: "+item.singer}</Text>
                            <Text style={{color:'#8B8B8B',marginLeft:10,marginTop:5,fontSize:15,fontFamily:'kanitSemiBold'}}>{"เพิ่มเติม: "+item.detail}</Text>
                        </View>
                        
              </View>
        </TouchableOpacity>:
        
        <View style={styles.songBar}>
                        <View style={{backgroundColor:'#E2E2E2',height:80,width:70,borderRadius:10,margin:10,marginLeft:1,justifyContent:'center',alignItems:'center',marginLeft:10}}>
                            <Image source={{uri:'https://image.flaticon.com/icons/png/512/126/126493.png'}} style={{height:45,width:45}}></Image>
                        </View>
                        <View style={{marginTop:5,marginBottom:5,height:100,width:'75%'}}>
                            <Text style={{color:'black',marginLeft:10,fontSize:16,fontFamily:'kanitSemiBold'}}>{"เพลง: "+item.name}</Text>
                            <Text style={{color:'#8B8B8B',marginLeft:10,marginTop:5,fontSize:15,fontFamily:'kanitSemiBold'}}>{"ศิลปิน: "+item.singer}</Text>
                            <Text style={{color:'#8B8B8B',marginLeft:10,marginTop:5,fontSize:15,fontFamily:'kanitSemiBold'}}>{"เพิ่มเติม: "+item.detail}</Text>
                        </View>
                        
              </View>}
      



        {this.state.songID==item.id&&<Modal transparent={true} visible={this.state.popup} animationType='fade'>
              <View style={{flex:1,backgroundColor:'#00000060',justifyContent:'center',alignItems:'center'}}>
                  <View style={{backgroundColor:'white',height:200,width:350,borderRadius:30,justifyContent:'space-evenly'}}>
                      <View style={{height:100,width:'100%',flex:2,justifyContent:'center',alignItems:'center'}}>
                        <Text style={{fontSize:20,fontFamily:'kanitSemiBold'}}>ต้องการเล่นเพลงนี้หรือไม่</Text>

                      </View>
                      <View style={{height:1,backgroundColor:'black',width:'100%'}}></View>
                      <View style={{height:100,width:'100%',flex:1,flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
                      <TouchableOpacity style={{flex:1,height:100,justifyContent:'center',alignItems:'center',borderBottomLeftRadius:30}} onPress={()=>{this.setState({popup:false})}}>
                        <View >
                        <Text style={{fontSize:20,fontFamily:'kanitSemiBold'}}>ยกเลิก</Text>
                      </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={{flex:1,height:100,justifyContent:'center',alignItems:'center',borderBottomRightRadius:30}} onPress={this.onSelected}>
                        <View >
                        <Text style={{fontSize:20,fontFamily:'kanitSemiBold',color:'#8B63FB'}}>เล่น</Text>
                      </View>
                      </TouchableOpacity>
                      
                      
                      </View>

                  </View>
              </View>

            </Modal>}
      </View>
    );
  }

  
  //////////////////////////////////////////////////////////////////////////////////
  componentDidMount=async()=>{

    await firestore.getAllSong(this.success,this.unsuccess)
  }
  //////////////////////////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////////////////////////
  success = (querySnapshot) => {
    //console.log(querySnapshot)
  
    var songs = []
    querySnapshot.forEach(function(doc){ 
      let song = doc.data()
      song.id  = doc.id
      songs = songs.concat(song)
    })
    this.props.save(songs)
  }
  unsuccess=(error)=>{
      console.log(error)
  }
  addSuccess=(docRef)=>{
    this.setState({showModal:false});
    let songs=[];
    let song={
        id:docRef.id,
        name:this.state.name,
        singer:this.state.singer,
        detail:this.state.detail,
    }
    songs=songs.concat(song)
    this.props.add(songs);
    this.setState({name:'-'})
    this.setState({singer:'-'})
    this.setState({detail:'-'})
  
  }
  addUnSuccess=(error)=>{
    console.log(error);
  }
  AddSong = async()=>{
    console.log('add success')
      let song = {
        name:this.state.name,
        singer:this.state.singer,
        detail:this.state.detail,
      }
      if(this.state.name!="-"&&this.state.singer!="-"){
        await firestore.addSong(song,this.addSuccess,this.addUnSuccess);
      }
      else{
        alert("กรุณาบอกชื่อเพลงและชื่อศิลปิน")
      }
      
      
  }
onRefresh2=()=>{
    this.setState({refreshing:false})
  }
onRefresh=()=>{
  this.setState({refreshing:true})
  firestore.getAllSong(this.success,this.unsuccess)
  this.onRefresh2()
}
  render(props) {
    const { navigation } = this.props;
    return (
      <View style={{flex:1}}>
        
        <View style={{backgroundColor:'black',width:200,height:30,borderRadius:5,marginLeft:20,alignItems:'center',justifyContent:'center'}}>
          <Text style={{fontFamily:'kanitSemiBold',color:'white'}}>คิวเพลงทั้งหมด {this.props.todos.length} เพลง</Text>
        </View>

        <FlatList
            data={this.props.todos}
            keyExtractor = {item=>item.id}
            renderItem={this.renderItem}
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh}
            ref={(ref)=>{this.FlatListRef=ref}}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={()=>{this.setState({showModal:true})}}
          style={styles.touchableOpacityStyle}>
          <View style={styles.floatingButtonStyle}>
                <Entypo  name="plus" size={24} color="white" />
          </View>
        </TouchableOpacity>

        <Modal 
                    transparent={true} 
                    visible={this.state.showModal} 
                    animationType="slide"
              >
            <View  style={{backgroundColor:'#00000090',justifyContent:'center',alignItems:'center',flex:1,paddingTop:Constants.statusBarHeight}}>
                <View style={styles.createModal}>
                    <View style={{height:100,width:'100%',borderRadius:10,justifyContent:'center',alignItems:'center',flex:2,}}>
                    <View style={{marginTop:100,backgroundColor:'#E2E2E2',height:'90%',width:'20%',borderRadius:10,justifyContent:'center',alignItems:'center'}}>
                        <Image source={{uri:'https://image.flaticon.com/icons/png/512/126/126493.png'}} style={{height:'55%',width:'60%'}}></Image>
                    </View>
                    <View style={{marginTop:10,marginBottom:30}}>
                      <Text style={{fontSize:20,fontFamily:'kanitSemiBold'}}>ขอคิวเพลง</Text>
                    </View>
                        
                    </View>
                    <View style={{height:1,backgroundColor:'#65656590',marginTop:60,marginLeft:15,marginRight:15}}></View> 
                    <View style={{flex:3,justifyContent:'space-around',padding:10}}>
                        <View style={{height:'30%',borderRadius:35,borderWidth:1,justifyContent:'center',alignItems:'center'}} >
                            <TextInput placeholder='ป้อนชื่อเพลง' style={{width:'80%',fontFamily:'kanitSemiBold'}} onChangeText={(txt)=>{this.setState({name:txt})}}></TextInput>
                        </View>
                        <View style={{height:'30%',borderRadius:35,borderWidth:1,justifyContent:'center',alignItems:'center'}} >
                          <TextInput placeholder='ศิลปิน' style={{width:'80%',fontFamily:'kanitSemiBold'}} onChangeText={(txt)=>{this.setState({singer:txt})}}></TextInput>
                        </View>
                        <View style={{height:'30%',borderRadius:35,borderWidth:1,justifyContent:'center',alignItems:'center'}} >
                            <TextInput placeholder='รายละเอียดเพิ่มเติม' style={{width:'80%',fontFamily:'kanitSemiBold'}} onChangeText={(txt)=>{this.setState({detail:txt})}}></TextInput>
                        </View>
                    </View>

                    {/* //////////////////////////////////////////////////////// */}
                    <View style={{height:1,backgroundColor:'#65656590',marginLeft:15,marginRight:15}}></View> 
                    <View style={{flex:2,justifyContent:'center',flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>{this.setState({showModal:false})}}>
                    <View style={{alignItems:'center',justifyContent:'center',marginRight:80,height:'100%'}}>
                         <Text style={{fontSize:17,marginTop:16,fontFamily:'kanitSemiBold'}}>ยกเลิก</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.AddSong}>
                      <View style={{justifyContent:'center',alignItems:'center',marginLeft:80,height:'100%'}}>
                         <Text style={{color:'#8B63FB',fontSize:17,marginTop:16,fontFamily:'kanitSemiBold'}}>ส่งคำขอ</Text>
                      </View>
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
          </Modal>
        
      </View>
    );
  }
}
const styles = StyleSheet.create({
  header:{
    width:'100%',
    height:'8%',
    backgroundColor:'black',
    flexDirection:'row',
  },
  createModal:{
    backgroundColor:'white',
    height:400,
    width:350,
    borderRadius:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,

  },
  touchableOpacityStyle: {
    position: 'absolute',
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 60,
    height: 60,
    backgroundColor:'#FB7070',
    borderRadius:50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,

    elevation: 6,
    justifyContent:'center',
    alignItems:'center'
    //backgroundColor:'black'
  },
  songBar:{
    backgroundColor:'white',
    //borderWidth:1,
    borderRadius:10,
    flexDirection:'row',
    marginRight:10,
    marginLeft:10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
    alignItems:'center'
  }

  });
  
  const mapDispatchToProps=(dispatch)=>{
    return{
      add:(name,singer,detail)=>dispatch(addSong(name,singer,detail)),
      save:(name,singer,detail)=>dispatch(saveSong(name,singer,detail)),
      del:(data)=>dispatch(deletedSong(data)),
    }
  }
  
  const mapStateToProps=(state)=>{
    return{
      todos:state.songReducer.songList,
      type:state.profileReducer.profile,
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(Song);
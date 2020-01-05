import React, {Component} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import {Appbar, Text, Searchbar} from 'react-native-paper';
import I18n from '../../components/i18n';
import {styles} from '../../components/styles';
import {Badge, ListItem, Icon} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Swipeout from 'react-native-swipeout';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';

const IS_IOS = Platform.OS === 'ios';

export default class ChatListView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      spinner: false,
      search: '',
      refreshing: false,
      chatRooms: [],
    };
  }

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#09A650'}}>
          <Appbar.Content
            title={I18n.t('placeholder.chat')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  componentWillMount = async () => {
    this.setState({spinner: true});
    let user = await GFunction.user();
    await this.setState({user: user});
    let resp = await Api.getChatRoom(this.state.user.authentication_jwt);
    if (resp.success) {
      this.setState({
        spinner: false,
        chatRooms: resp.chat_rooms,
      });
    }
  };

  realTimeData(data) {
    if (data.noti_type === 'chat' || data.noti_type.includes('request_join-')) {
      let chatRoom = JSON.parse(data.chat_room);
      let chatRoomIndex = this.state.chatRooms.findIndex(
        c => c.id === chatRoom.id,
      );

      this.state.chatRooms[chatRoomIndex] = chatRoom;
      this.setState({
        chatRooms: this.state.chatRooms,
      });
    }
  }

  componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(message => {
      this.realTimeData(message._data);
    });

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        this.realTimeData(notification._data);
      });
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
  }

  refreshChatRoom = async () => {
    await this.setState({refreshing: true});
    let resp = await Api.getChatRoom(this.state.user.authentication_jwt);
    if (resp.success) {
      await this.setState({
        chatRooms: resp.chat_rooms,
        refreshing: false,
      });
    }
  };

  listChatRoom = chats => {
    return (
      <FlatList
        style={{flex: 1}}
        data={chats}
        renderItem={({item, index}) => {
          return (
            <Swipeout
              autoClose={true}
              right={[
                {
                  text: 'Delete',
                  type: 'delete',
                  onPress: () => {
                    this.alertRemoveChatMember(item.id, index);
                  },
                },
              ]}
              style={{
                backgroundColor: '#FFF',
                fontFamily: 'Kanit-Light',
              }}>
              <ListItem
                key={index}
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftAvatar={{
                  title: item.name[0],
                  activeOpacity: 0.2,
                }}
                title={item.name}
                titleStyle={{fontFamily: 'Kanit-Light'}}
                subtitle={item.last_messags}
                subtitleStyle={{fontFamily: 'Kanit-Light'}}
                onPress={() => this.goToChatRoom(item)}
                chevron={<Badge value={index + 10} status="error" />}
              />
            </Swipeout>
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  alertRemoveChatMember(id, index) {
    Alert.alert(
      '',
      'Are your sure tou want to delete this chat ?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => this.state(id, index),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  }

  async removeChat(id, index) {
    this.state.chatRooms.splice(index, 1);
    await this.setState({chatRooms: this.state.chat_rooms});
    GFunction.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeChatSuccessful'),
    );
  }

  goToChatRoom(chatRoom) {
    this.props.navigation.navigate('ChatRoom', {
      chatRoom: chatRoom,
      isRequestJoin: false,
    });
  }

  render() {
    return (
      <View style={styles.chatView}>
        {this.AppHerder()}
        <View style={{padding: 15}}>
          <Searchbar
            theme={{
              colors: {
                placeholder: '#6D6D6D',
                text: '#000',
                primary: '#000',
                underlineColor: '#6D6D6D',
              },
              fonts: {regular: 'Kanit-Light'},
            }}
            inputStyle={{fontFamily: 'Kanit-Light'}}
            placeholder={I18n.t('placeholder.search')}
            onChangeText={searching => {
              this.setState({search: searching});
            }}
            value={this.state.search}
          />
        </View>
        {this.state.spinner ? (
          <Spinner
            visible={this.state.spinner}
            textContent={`${I18n.t('placeholder.loading')}...`}
            textStyle={styles.spinnerTextStyle}
          />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.refreshChatRoom}
              />
            }>
            <View style={{flex: 1}}>
              {this.listChatRoom(this.state.chatRooms)}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

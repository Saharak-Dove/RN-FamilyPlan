import React, {Component, useRef} from 'react';
import {
  Dimensions,
  FlatList,
  Platform,
  Modal,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  View,
} from 'react-native';
import {Appbar, Text, Searchbar} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import {styles} from '../../components/styles';
import I18n from '../../components/i18n';
import Modalize from 'react-native-modalize';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import PTRView from 'react-native-pull-to-refresh';
import Spinner from 'react-native-loading-spinner-overlay';
import {Icon} from 'react-native-elements';

// View
import NewGroupView from '../Modal/NewGroupVew';
import QrCodeView from '../Modal/QrCodeView';
import JoinGroupView from '../Modal/JoinGroupView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

const members = [
  {
    name: 'Amy Farha',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
  },
  {
    name: 'Amy Farha',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
  },
];

const groups = [
  {
    name: 'G Netflix',
    service: 'Netflix',
    color: '#F30635',
    members: members,
    max_member: 4,
    due_date: '05/11/2019',
    service_charge: 205,
  },
  {
    name: 'G Spotify',
    service: 'Spotify',
    color: '#009652',
    members: members,
    max_member: 5,
    due_date: '06/11/2019',
    service_charge: 105,
  },
  {
    name: 'G Disney Plus',
    service: 'Disney Plus',
    color: '#454746',
    members: members,
    max_member: 5,
    due_date: '03/11/2019',
    service_charge: 35,
  },
  {
    name: 'G Apple Music',
    service: 'Apple Music',
    color: '#FF116F',
    members: members,
    max_member: 6,
    due_date: '09/11/2019',
    service_charge: 46,
  },
  {
    name: 'G Apple Music',
    service: 'Apple Music',
    color: '#FF116F',
    members: members,
    max_member: 6,
    due_date: '12/11/2019',
    service_charge: 79,
  },
  {
    name: 'G Netflix',
    service: 'Netflix',
    color: '#F30635',
    members: members,
    max_member: 4,
    due_date: '23/11/2019',
    service_charge: 80,
  },
  {
    name: 'G Spotify',
    service: 'Spotify',
    color: '#009652',
    members: members,
    max_member: 5,
    due_date: '21/11/2019',
    service_charge: 90,
  },
  {
    name: 'G Disney Plus',
    service: 'Disney Plus',
    color: '#454746',
    members: members,
    max_member: 5,
    due_date: '19/11/2019',
    service_charge: 150,
  },
  {
    name: 'T Apple Music',
    service: 'Apple Music',
    color: '#FF116F',
    members: members,
    max_member: 6,
    due_date: '16/11/2019',
    service_charge: 199,
  },
];

export default class HomeView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      groupName: '',
      spinner: false,
      modalGroup: false,
      group: null,
      refreshing: false,
      services: [],
      myGroups: [],
      publicGroups: [],
    };
  }

  componentDidMount = async () => {
    this.setState({spinner: true});
    let user = await GFunction.user();
    let resp = await Api.getGroup(user.authentication_token);
    if (resp.success) {
      this.setState({
        spinner: false,
        myGroups: resp.my_groups,
        publicGroups: resp.public_groups,
        services: resp.services,
      });
    }
  };

  newGroupModal = React.createRef();
  scanQrCodeModal = React.createRef();
  joinGroupModal = React.createRef();

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#2370E6" barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#2370E6'}}>
          <Appbar.Content title={I18n.t('placeholder.appName')} />
        </Appbar.Header>
      </View>
    );
  }

  showNewGroupModal = () => {
    if (this.newGroupModal.current) {
      this.newGroupModal.current.open();
    }
  };

  popUpModalNewGroup() {
    return (
      <Modalize
        ref={this.newGroupModal}
        modalStyle={styles.popUpModal}
        overlayStyle={styles.overlayModal}
        handleStyle={styles.handleModal}
        modalHeight={height / 1.08}
        handlePosition="inside"
        openAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        closeAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        withReactModal
        adjustToContentHeight>
        <NewGroupView
          modal={this.newGroupModal}
          services={this.state.services}
          myGroups={this.state.myGroups}
          onSetAndGoToModalGroup={this.setAndGoToModalGroup}
        />
      </Modalize>
    );
  }

  showScanQrCodeModal = () => {
    if (this.scanQrCodeModal.current) {
      this.scanQrCodeModal.current.open();
    }
  };

  popUpModalScanQrCode() {
    return (
      <Modalize
        ref={this.scanQrCodeModal}
        modalStyle={styles.popUpModal}
        overlayStyle={styles.overlayModal}
        handleStyle={styles.handleModal}
        modalHeight={height / 1.08}
        handlePosition="inside"
        openAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        closeAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        withReactModal>
        <QrCodeView modal={this.scanQrCodeModal} />
      </Modalize>
    );
  }

  showJoinGroupModal = group => {
    if (this.joinGroupModal.current) {
      this.setState({group: group});
      this.joinGroupModal.current.open();
    }
  };

  popUpModalJoinGroup(group) {
    return (
      <Modalize
        ref={this.joinGroupModal}
        modalStyle={styles.popUpModal}
        overlayStyle={styles.overlayModal}
        handleStyle={styles.handleModal}
        modalHeight={height / 1.08}
        handlePosition="inside"
        openAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        closeAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        withReactModal
        adjustToContentHeight>
        <JoinGroupView
          modal={this.joinGroupModal}
          group={group}
          onGoToModalGroup={this.goToModalGroup}
        />
      </Modalize>
    );
  }

  refreshGroup = async () => {
    await this.setState({refreshing: true});
    let user = await GFunction.user();
    let resp = await Api.getGroup(user.authentication_token);
    if (resp.success) {
      await this.setState({
        refreshing: false,
        myGroups: resp.my_groups,
        publicGroups: resp.public_groups,
        services: resp.services,
      });
    }
  };

  listMyGroup = myGroup => {
    return (
      <FlatList
        style={{flex: 1}}
        data={myGroup}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => this.goToModalGroup(item)}>
              <View style={{flex: 1}}>
                <View
                  style={[styles.headerCard, {backgroundColor: item.color}]}>
                  <Text numberOfLines={1} style={styles.textHeadCard}>
                    {item.serviceName}
                  </Text>
                </View>
                <View style={{flex: 0.4}}>
                  <Text numberOfLines={1} style={styles.textNameCard}>
                    {item.name}
                  </Text>
                </View>
                <View style={{flex: 0.3}}>
                  <Text numberOfLines={1} style={styles.totalMembersCard}>
                    {I18n.t('placeholder.members')} : {item.members.length}/
                    {item.max_member}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  listPublicGroup = publicGroup => {
    return (
      <FlatList
        style={{flex: 1}}
        data={publicGroup.filter(
          group => group.members.length < group.max_member,
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({item, index}) => {
          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => this.showJoinGroupModal(item)}>
              <View style={{flex: 1}}>
                <View
                  style={[styles.headerCard, {backgroundColor: item.color}]}>
                  <Text numberOfLines={1} style={styles.textHeadCard}>
                    {item.serviceName}
                  </Text>
                </View>
                <View style={{flex: 0.4}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 20,
                      color: '#000',
                      alignSelf: 'center',
                      padding: 15,
                    }}>
                    {item.name}
                  </Text>
                </View>
                <View style={{flex: 0.3}}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontSize: 13,
                      color: '#000',
                      alignSelf: 'center',
                      justifyContent: 'flex-end',
                      padding: 10,
                    }}>
                    {I18n.t('placeholder.members')} : {item.members.length}/
                    {item.max_member}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  goToModalGroup = group => {
    this.props.navigation.navigate('Group', {group: group});
  };

  setAndGoToModalGroup = async myGroups => {
    await this.setState({myGroups: myGroups});
    this.props.navigation.navigate('Group', {
      group: myGroups[0],
    });
  };

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{padding: 10}}>
          <Searchbar
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
            textContent={I18n.t('placeholder.loading') + '...'}
            textStyle={styles.spinnerTextStyle}
          />
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.refreshGroup}
              />
            }>
            <View style={{flex: 1, padding: 15, paddingTop: 35}}>
              <View style={{flex: 1}}>
                <View style={styles.listCard}>
                  <Text style={styles.textCardList}>
                    {I18n.t('placeholder.myGroup')}
                  </Text>
                </View>
                <View style={styles.listCards}>
                  {this.state.myGroups.length !== 0 ? (
                    this.listMyGroup(this.state.myGroups)
                  ) : (
                    <View>
                      <TouchableOpacity
                        style={styles.card}
                        onPress={this.showNewGroupModal}>
                        <View style={{flex: 1}}>
                          <View style={styles.headerCardNewGroup}>
                            <Icon
                              reverse
                              name="add"
                              type="mat-icon"
                              color="#00C15E"
                            />
                          </View>
                          <View style={{flex: 0.4}}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 20,
                                color: '#000',
                                alignSelf: 'center',
                                padding: 15,
                              }}>
                              {I18n.t('placeholder.newGroup')}
                            </Text>
                          </View>
                          <View style={{flex: 0.3}}>
                            <Text
                              numberOfLines={1}
                              style={{
                                fontSize: 13,
                                color: '#000',
                                alignSelf: 'center',
                                justifyContent: 'flex-end',
                                padding: 10,
                              }}>
                              {I18n.t('placeholder.clickNewGroup')}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>

              {this.state.publicGroups.length !== 0 ? (
                <View style={{flex: 1, paddingTop: 40}}>
                  <View style={styles.listPublicCard}>
                    <Text style={styles.textCardList}>
                      {I18n.t('placeholder.publicGroup')}
                    </Text>
                  </View>
                  <View style={styles.listCards}>
                    {this.listPublicGroup(this.state.publicGroups)}
                  </View>
                </View>
              ) : null}
            </View>
          </ScrollView>
        )}

        {this.popUpModalJoinGroup(this.state.group)}
        {this.popUpModalNewGroup()}
        {this.popUpModalScanQrCode()}
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#03C8A1"
            title={I18n.t('placeholder.newGroup')}
            onPress={this.showNewGroupModal}>
            <MatIcon name="group-add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3D71FB"
            title={I18n.t('placeholder.qrCode')}
            onPress={this.showScanQrCodeModal}>
            <FAIcon name="qrcode" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

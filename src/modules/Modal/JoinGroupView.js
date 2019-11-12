import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import {
  Appbar,
  Text,
  TextInput
} from 'react-native-paper';
import I18n from '../../components/i18n';
import { Dropdown } from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { Icon } from 'react-native-elements'
import * as Api from '../../util/Api'
import * as GFunction from '../../util/GlobalFunction'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class JoinGroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  clickJoinGroup() {
    this.loadingJoinGroup.showLoading(true);
    setTimeout(() => {
      if (this.props.modal.current) {
        this.loadingJoinGroup.showLoading(false);
        GFunction.successMessage(I18n.t('message.success'), I18n.t('message.joinGroupSuccessful'))
        this.props.modal.current.close();
        this.props.onGoToModalGroup(this.props.group);
      }
    }, 1000)
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 30 }}>
        <Text style={{ fontSize: 30 }}>
          {I18n.t('placeholder.joinGroup')}
        </Text>
        <View style={{ paddingTop: 15, paddingLeft: 15 }}>
          <Text style={{ fontSize: 20 }}>
            {I18n.t('placeholder.name') + ' : ' + this.props.group.name}
          </Text>
          <Text style={{ fontSize: 20 }}>
            {I18n.t('placeholder.service') + ' : ' + this.props.group.service}
          </Text>
          <Text style={{ fontSize: 20 }}>
            {I18n.t('placeholder.members') + ' : ' + this.props.group.members + '/' + this.props.group.max_member}
          </Text>
        </View>

        <View style={{ paddingTop: 35 }}>
          <AnimateLoadingButton
            ref={c => (this.loadingJoinGroup = c)}
            width={width - 25}
            height={50}
            title={I18n.t('button.joinGroup')}
            titleFontSize={18}
            titleColor='#FFF'
            backgroundColor='#03C8A1'
            borderRadius={25}
            onPress={this.clickJoinGroup.bind(this)}
          />
        </View>
      </View>
    );
  }
};
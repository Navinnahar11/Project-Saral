import React, { Component } from 'react';
import { View,Text, BackHandler } from 'react-native';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash'
import AppTheme from '../../utils/AppTheme';
import { MultiBrandingAction } from '../../flux/actions/apis/multiBranding';
import { LogoutAction } from '../../flux/actions/apis/LogoutAction';
import APITransport from '../../flux/actions/transport/apitransport';
import Brands from '../common/components/Brands';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Assets } from '../../assets';
import { monospace_FF } from '../../utils/CommonUtils';

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
        }
        this.onBack = this.onBack.bind(this)
    }
    componentDidMount() {
        const { navigation } = this.props;
        setTimeout(
            () => this.setState(prevState => ({ isLoading: !prevState.isLoading })),
            5000,
        );
        if (this.props.minimalFlag) {
            navigation.addListener('willFocus', async payload => {
                BackHandler.addEventListener('hardwareBackPress', this.onBack)
            })
            this.willBlur = navigation.addListener('willBlur', payload =>
                BackHandler.removeEventListener('hardwareBackPress', this.onBack)
            );
        }
        
        this.callMultiBrandingActiondata()
    }

    callMultiBrandingActiondata() {
        let payload = this.props.multiBrandingData
        let token = this.props.loginData.data.token
        let apiObj = new MultiBrandingAction(payload, token);
        this.props.APITransport(apiObj)

    }

    onBack = () => {
        const { navigation } = this.props;
        BackHandler.exitApp()
        // navigation.goBack();
        return true
    }

    render() {
        if(this.props.multiBrandingData === undefined || this.props.multiBrandingData === null){
           
            return <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
            {

                this.state.isLoading ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: 'bold', fontFamily : monospace_FF }}>Loading Branding ...</Text>
                    </View> :
                        <Brands
                            Image1={Assets.AppLogo}
                            appName={'Saral OCR App'}
                            themeColor={AppTheme.BLUE}
                            onPress={() => this.props.navigation.navigate('selectDetails')}
                        />
            }
        </View>

        }
        return (
            <View style={{ flex: 1, backgroundColor: AppTheme.WHITE_OPACITY }}>
                            <Brands
                                Image={this.props.multiBrandingData && 'data:image/png;base64,' + this.props.multiBrandingData.logoImage}
                                appName={this.props.multiBrandingData && this.props.multiBrandingData.appName}
                                themeColor={this.props.multiBrandingData && this.props.multiBrandingData.themeColor1}
                                onPress={() => this.props.minimalFlag ? this.props.navigation.navigate("myScan") : this.props.navigation.navigate('selectDetails')}
                            /> 
            </View>
        );
    }
}


const mapStateToProps = (state) => {
    return {
        loginData: state.loginData,
        multiBrandingData: state.multiBrandingData.response.data,
        minimalFlag: state.minimalFlag
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        APITransport: APITransport,
        LogoutAction: LogoutAction
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeComponent);

import { Text, View } from 'react-native'
import React, { Component } from 'react'
import moment from 'moment'

import CryptoJS from 'crypto-js'
import crypto from 'crypto-js'
import hmacSHA256 from 'crypto-js/hmac-sha256';
import hmacSHA512 from 'crypto-js/hmac-sha512';
import Base64 from 'crypto-js/enc-base64';
import enc_utf8 from 'crypto-js/enc-utf8';
import Utf8 from 'crypto-js/enc-utf8';

const JAZZCASH_HTTP_POST_URL = 'https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction'
const INTEGRITY_KEY = "318c8uvg51"
var arr = []
export default class JAzzCash extends Component {

    state = {

        pp_Language: "EN",
        pp_MerchantID: "MC35289",
        pp_SubMerchantID: "",
        pp_Password: "vy0240sbe0",
        pp_TxnRefNo: "",
        pp_MobileNumber: "03411728699",
        pp_CNIC: "345678",
        pp_Amount: "10000",
        pp_TxnType: "MWALLET",
        pp_DiscountedAmount: "",
        pp_TxnCurrency: "PKR",
        pp_TxnDateTime: "",
        pp_BillReference: "BillRef",
        pp_Description: "Hello",
        pp_TxnExpiryDateTime: "",
        pp_SecureHash: "",
        ppmpf_1: "",
        ppmpf_2: "",
        ppmpf_3: "",
        ppmpf_4: "",
        ppmpf_5: ""

    }

    secureHash = (data) => {
        // console.log(JSON.stringify(data));
        // → '{"b":"foo","c":"bar","a":"baz"}'

        const ordered = Object.keys(data).sort().reduce(
            (obj, key) => {
                obj[key] = data[key];
                return obj;
            },
            {}
        );

        // console.log(JSON.stringify(ordered));

        var hash = ""
        Object.entries(ordered).forEach(
            ([key, value]) => {
                if (value != "") {
                    hash += '&' + value
                }
            }
        );
        //  console.log(hash);
        return hash;
    }


    convertToSHA = async (string) => {

        await sha256(string).then((hash) => {
            console.log(hash);
        });

    };



       componentDidMount = async () => {

        var date = new Date()
        date = date.getFullYear() + ("0" + (date.getMonth())).slice(-2) +    ("0"+date.getDate()).slice(-2) + ("0" + date.getHours()).slice(-2) + ("0" + date.getMinutes()).slice(-2) + ("0" + date.getSeconds()).slice(-2)
         var date1 = new Date()
         date1.setHours(date1.getHours() + 1);
        date1 = date1.getFullYear() + ("0" + (date1.getMonth())).slice(-2) + ("0" +   date1.getDate()).slice(-2) + ("0" + date1.getHours()).slice(-2) + ("0" + date1.getMinutes()).slice(-2) + ("0" + date1.getSeconds()).slice(-2)
        var tXID = 'T' + date

           await this.setState({
            pp_TxnDateTime: date,
            pp_TxnExpiryDateTime: date1,
            pp_TxnRefNo: 'T' + date,
            // pp_BillReference: 'T' + date,
        })

        var hash = this.secureHash(this.state)
        hash = INTEGRITY_KEY + hash; //Integritykey + hashString
        console.log('HASH======> ', hash);


        const hmacDigest = hmacSHA256(hash, INTEGRITY_KEY).toString();
        console.log('SecureHash======> ', hmacDigest);

        // const hmacDigest11 = Utf8.stringify(hmacSHA256(hash, INTEGRITY_KEY))
        // let encData = CryptoJS.enc.Utf8.stringify(hash, INTEGRITY_KEY)
        // console.log('SecureHash11======> ', encData);


        // console.log("HASH ,", hash);
        await this.setState({
            "pp_SecureHash": hmacDigest
        })


        // await console.log("SecureHash1 ", this.state);



        fetch(JAZZCASH_HTTP_POST_URL, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state)
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data.pp_ResponseMessage)
            });
    }

    render() {
        return (
            <View>
                <Text>JAzzCash</Text>
            </View>
        )
    }

}
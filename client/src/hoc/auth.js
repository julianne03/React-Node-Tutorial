import axios from 'axios';
import React, { useEffect } from 'react';
import Axios from 'axios';
import { useDispatch } from 'react-redux';
import { auth } from '../_actions/user_action';

export default function(SpecificComponent, option, adminRoute = null) {

    // option에 따른 화면 처리
    // null -> 아무나 출입이 가능한 페이지
    // true -> 로그인한 유저만 출입이 가능한 페이지
    // false -> 로그인한 유저는 출입이 불가능한 페이지

    function AuthenticationCheck(props) {

        const dispatch = useDispatch();

        useEffect(() => {
            dispatch(auth()).then(response => {
                console.log(response)

                // 로그인 하지 않은 상태
                if(!response.payload.isAuth) {
                    if(option) {
                        // 로그인한 유저가 출입이 가능하면
                        props.history.push('/login')
                    }
                } else {
                    // 로그인 한 상태
                    if(adminRoute && !response.payload.isAdmin) {
                        // admin 유저가 아닐 때
                        props.history.push('/')
                    } else {
                        if(option === false) {
                            // 로그인한 사용자는 회원가입이나 로그인 X
                            props.history.push('/')
                        }
                    }
                }
            })

        }, [])

        return (
            <SpecificComponent />
        )
    }

    return AuthenticationCheck
}
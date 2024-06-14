import {atom} from 'recoil';

export const chatAtom = atom({
    key: 'chatAtom',
    default: []
});

export const selectedChatAtom = atom({
    key: 'selectedChatAtom',
    default: {
        _id:"",
        userId: "",
        name: "",
        username: "",
        userProfilePic: "",
    }
});
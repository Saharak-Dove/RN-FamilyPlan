import AsyncStorage from '@react-native-community/async-storage';
import { showMessage, hideMessage } from 'react-native-flash-message';

export async function user() {
  return JSON.parse(await AsyncStorage.getItem('user'));
}

export function successMessage(message, description) {
  showMessage({
    message: message,
    description: description,
    type: 'default',
    backgroundColor: '#02E35E',
    color: '#FFF',
    duration: 3000
  });
}

export function errorMessage(message, description) {
  showMessage({
    message: message,
    description: description,
    type: 'default',
    backgroundColor: '#F60645',
    color: '#FFF',
    duration: 3000
  });
}

export function camelize(str) {
  return str
    .replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
      return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
    })
    .replace(/\s+/g, '')
    .replace(/\./g, '');
}

export function validateEmail(email) {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(email) === false && email != ''
}

export function validatePhoneNumber(phoneNumber) {
  return phoneNumber.length < 10 && phoneNumber != ''
}

export function validatePasswordLessThanSix(password) {
  return password.length < 6 && password != ''
}

export function validatePasswordMatch(password, confirmPassword) {
  return password != confirmPassword && confirmPassword != ''
}

export function validateBlank(value) {
  return value == ''
}
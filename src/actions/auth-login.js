import fetch from 'cross-fetch'

function throwError(err) { throw err }

function authSuccess (userInfo) {
	console.log(userInfo)
	return {
	type:'USER_AUTHENTICATED',
	userInfo
	}

} 

function authFail () {
	return {
	type: 'INVALID_CREDENTIALS'
	}
}


export function logOut() {
	return {
	type: 'LOG_OUT'
	}
}

export function attemptLogIn(credentials) {
	return dispatch => {
		return fetch('http://localhost:3001/authorize', {
		headers:{
			'Content-Type': 'application/json'
		},
		method: 'POST',
		mode: 'cors', 
		body: JSON.stringify(credentials)
		})
		.then(response => response.ok ? response.json() : throwError("Error"))
		.then(json => dispatch(authSuccess(json)))
		.catch(err => dispatch(authFail()))
	}

}
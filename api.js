// import { request, gql, GraphQLClient } from 'graphql-request'
import {gql} from 'graphql-request';

import http from 'http';
import fetch from 'node-fetch';
import FormData from 'form-data';

export const getUserInfo = async (username) => {
	var req = gql`
		query userByUsername($username: String!){
			userByUsername(username: $username){
				isBannedFromBoards
				karma
				image
				roles { key }
				posts(count: 2147483647){
					items {
						id
					}
				}
				comments(count: 2147483647){
					items{
						id
					}
				}
				publicRepls(count: 2147483647){
					items {
            id
          }
				}
			}
		}
	`
	var response = await gqlRequest('userByUsername', req, {username: username});
	let data = response.userByUsername;
	return(data ?
	{
		numRepls: data.publicRepls.items.length,
		isBanned: data.isBannedFromBoards,
		numCycles: data.karma,
		numPosts: data.posts.items.length,
		numComments: data.comments.items.length,
		image: data.image,
		error: false
	}
	: {
		numRepls: 0,
		isBanned: false,
		numCycles: 0,
		numPosts: 0,
		numComments: 0,
		image: 'https://replit.com/public/images/evalbot/evalbot_28.png',
		error: true
	});
}

export const talkStats = async(username) => {
	var req = gql`
	guery userByUsername($username: String!){
		userByUsername(username: $username){
			isBannedFromBoards
		}
	`
}

const gqlRequest = async (name, query, variables) => {
	var vari = variables? variables : {}
	var gqlPayload = {
		operationName: name,
		query: query,
		variables: vari
	}
	// var gqlForm = new FormData();
	// gqlForm.append('operationName', name);
	// gqlForm.append('query', query);
	// gqlForm.append('variables', vari);

	// var headers = new Headers({
	// 	'Accept': 'application/json',
	// 	'x-requested-with': 'ReplitGithubWidget',
	// 	'cookie': 'connect.sid='+null
	// });
	console.log(gqlPayload);
	
	// http

	var res = await fetch('https://replit.com/graphql', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'content-type': 'application/json',
			'x-requested-with': 'ReplitGithubWidget',
			'cookie': 'connect.sid=' + null,
			'user-agent': 'ReplitGithubWidget',
			'referer': 'https://replit.com/@RoBlockHead/replit-github-widget'
		},
		// form: getFormData(gqlPayload),
		body: JSON.stringify(gqlPayload),
	});
	var json = await res.json();
	console.log(json)
	return json.data;
}
// function getFormData(object) {
//     const formData = new FormData();
// 		for(var i; i<)
//     Object.keys(object).forEach(key => formData.append(key, object[key]));
//     return formData;
// }
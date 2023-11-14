#! /usr/bin/env node
/* eslint-disable no-console */

/*
This script populates some chemicals, products, and groups to database.
Specified DB connection string as argument - e.g.: node populateDb
"mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/database_name?retryWrites=true&w=majority"
*/
/*
This file should not be included in production
*/

// Get passwords
require('dotenv').config();

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

// Get models to manipulate with collections
// Do not create federated credentials here because it requires real credentials
const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');
require('./models/fc'); // Still require to create an empty collection anyway

// Connection preparation and data population
const users = []; // Array of documents created, to get id for referencing
const posts = [];
mongoose.set('strictQuery', false); // Prepare for Mongoose 7
const mongoDB = userArgs[0];

// Document creators
// Must pass idx so that can tell which document is which
// Otherwise order will jumble as the order of promise resolve is not known
async function createUser({
  displayName,
  username,
  password,
  email,
  gender,
  age,
  bio,
  friends,
}, idx) {
  const user = new User({
    displayName, username, password, email, gender, age, bio, friends,
  });
  await user.save();
  users[idx] = user;
  console.log(`Added user: ${user.displayName}`);
}

async function createPost({
  content,
  user,
  pat,
}, idx) {
  const post = new Post({ content, user, pat });
  await post.save();
  posts[idx] = post;
  console.log(`Added a post from ${user.displayName}`);
}

// Function to actually create sample documents
// Posts need to refer to users, so create user first
async function createUserSampleDocuments() {
  console.log('Adding users');
  await Promise.all([
    createUser({
      displayName: 'Sophie Johnson',
      username: 'sophieJ',
      password: process.env.SAMPLE_PASSWORD_00,
      gender: 'female',
      age: 23,
      bio: 'Exploring the world one day at a time. Coffee enthusiast and book lover.',
    }, 0),
    createUser({
      displayName: 'Alex Thompson',
      username: 'alex_t',
      password: process.env.SAMPLE_PASSWORD_01,
      gender: 'male',
      bio: 'Tech geek, music lover, and aspiring chef. Let\'s connect!',
    }, 1),
    createUser({
      displayName: 'Priya Patel',
      username: 'priya123',
      password: process.env.SAMPLE_PASSWORD_02,
      gender: 'female',
      bio: 'Software engineer by day, Bollywood dancer by night. Passionate about technology and the arts.',
    }, 2),
    createUser({
      displayName: 'Emily Davis',
      username: 'emily_davis',
      password: process.env.SAMPLE_PASSWORD_03,
      gender: 'female',
      age: 21,
      bio: 'Dreamer, artist, and nature lover. Finding beauty in everyday moments.',
    }, 3),
    createUser({
      displayName: 'Michael Smith',
      username: 'mike_smith',
      password: process.env.SAMPLE_PASSWORD_04,
      gender: 'male',
      age: 31,
      bio: 'Sports fanatic and fitness enthusiast. Living life to the fullest!',
    }, 4),
    createUser({
      displayName: 'Yuki Tanaka',
      username: 'yuki_t',
      password: process.env.SAMPLE_PASSWORD_05,
      gender: 'female',
      bio: 'Art enthusiast, anime lover, and sushi connoisseur. Living life with creativity and joy.',
    }, 5),
    createUser({
      displayName: 'Chen Wei',
      username: 'chen_wei',
      password: process.env.SAMPLE_PASSWORD_06,
      gender: 'male',
      age: 26,
      bio: 'Explorer of traditions and modernity. Tea lover and technology geek.',
    }, 6),
    createUser({
      displayName: 'Mei Li',
      username: 'mei_li',
      password: process.env.SAMPLE_PASSWORD_07,
      gender: 'female',
      bio: 'Passionate about literature, traveling, and trying new cuisines. Embracing diversity.',
    }, 7),
  ]);
}

async function createPostSampleDocuments() {
  console.log('Adding posts');
  await Promise.all([
    createPost({
      content:
          "Feeling overwhelmed today. Sometimes life hits you hard, and it's okay not to be okay.",
      user: users[0],
    }, 0),
    createPost({
      content:
          "Dealing with self-doubt. It's a tough battle, but I'll keep pushing forward. 💪",
      user: users[2],
    }, 1),
    createPost({
      content:
          "Navigating through a maze of emotions. It's okay to feel lost sometimes.",
      user: users[2],
    }, 2),
    createPost({
      content: 'Heartbroken and trying to make sense of it all.',
      user: users[3],
    }, 3),
    createPost({
      content: "Frustrated with setbacks, but I won't let them define me. Every obstacle is a stepping stone.",
      user: users[4],
    }, 4),
  ]);
}

// Sample connections between users
async function createSampleConnections() {
  console.log('Adding connections between users');
  const connections = [
    [0, 1],
    [1, 5],
    [3, 5],
    [0, 3],
    [2, 7],
  ];
  const arr = [];
  connections.forEach(([n1, n2]) => {
    arr.push(User.beFriend(users[n1]._id, users[n2]._id));
  });
  await Promise.all(arr);
}

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createUserSampleDocuments(); // User first
  await Promise.all([ // Post and connection then
    createPostSampleDocuments(),
    createSampleConnections(),
  ]);
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

main().catch((err) => console.log(err));

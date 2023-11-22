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
const bcrypt = require('bcryptjs'); // To salt and hash passwords
const User = require('./models/user');
const Post = require('./models/post');
require('./models/fc'); // Still require to create an empty collection anyway
const FriendRequest = require('./models/friendRequest');

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
  bio,
  friends,
}, idx) {
  const user = new User({
    displayName, username, password, email, gender, bio, friends,
  });
  await user.save();
  users[idx] = user;
  console.log(`Added user: ${user.displayName}`);
}

async function createPost({
  content,
  user,
  isPublic,
  pat,
  created,
}, idx) {
  const post = new Post({
    content, user, isPublic, pat, created,
  });
  await post.save();
  posts[idx] = post;
  console.log(`Added a post from ${user.displayName}`);
}

// Function to actually create sample documents
// Posts need to refer to users, so create user first
async function createUserSampleDocuments() {
  console.log('Adding users');
  const allPasswordsUnhashed = [
    process.env.SAMPLE_PASSWORD_00,
    process.env.SAMPLE_PASSWORD_01,
    process.env.SAMPLE_PASSWORD_02,
    process.env.SAMPLE_PASSWORD_03,
    process.env.SAMPLE_PASSWORD_04,
    process.env.SAMPLE_PASSWORD_05,
    process.env.SAMPLE_PASSWORD_06,
    process.env.SAMPLE_PASSWORD_07,
    process.env.SAMPLE_PASSWORD_08,
    process.env.SAMPLE_PASSWORD_09,
    process.env.SAMPLE_PASSWORD_10,
    process.env.SAMPLE_PASSWORD_11,
    process.env.SAMPLE_PASSWORD_12,
    process.env.SAMPLE_PASSWORD_13,
    process.env.SAMPLE_PASSWORD_14,
    process.env.SAMPLE_PASSWORD_15,
    process.env.SAMPLE_PASSWORD_16,
    process.env.SAMPLE_PASSWORD_17,
  ];
  // Salt and hash passwords
  for (let i = 0; i < allPasswordsUnhashed.length; i += 1) {
    allPasswordsUnhashed[i] = bcrypt.hash(allPasswordsUnhashed[i], 10);
  }
  const allPasswords = await Promise.all(allPasswordsUnhashed); // Hashing is asynchronous
  await Promise.all([
    createUser({
      displayName: 'Sophie Johnson',
      username: 'sophieJ',
      password: allPasswords[0],
      gender: 'female',
      bio: 'Exploring the world one day at a time. Coffee enthusiast and book lover.',
    }, 0),
    createUser({
      displayName: 'Alex Thompson',
      username: 'alex_t',
      password: allPasswords[1],
      gender: 'male',
      bio: 'Tech geek, music lover, and aspiring chef. Let\'s connect!',
    }, 1),
    createUser({
      displayName: 'Priya Patel',
      username: 'priya123',
      password: allPasswords[2],
      gender: 'female',
      bio: 'Software engineer by day, Bollywood dancer by night. Passionate about technology and the arts.',
    }, 2),
    createUser({
      displayName: 'Emily Davis',
      username: 'emily_davis',
      password: allPasswords[3],
      gender: 'female',
      bio: 'Dreamer, artist, and nature lover. Finding beauty in everyday moments.',
    }, 3),
    createUser({
      displayName: 'Michael Smith',
      username: 'mike_smith',
      password: allPasswords[4],
      gender: 'male',
      bio: 'Sports fanatic and fitness enthusiast. Living life to the fullest!',
    }, 4),
    createUser({
      displayName: 'Yuki Tanaka',
      username: 'yuki_t',
      password: allPasswords[5],
      gender: 'female',
      bio: 'Art enthusiast, anime lover, and sushi connoisseur. Living life with creativity and joy.',
    }, 5),
    createUser({
      displayName: 'Chen Wei',
      username: 'chen_wei',
      password: allPasswords[6],
      gender: 'male',
      bio: 'Explorer of traditions and modernity. Tea lover and technology geek.',
    }, 6),
    createUser({
      displayName: 'Mei Li',
      username: 'mei_li',
      password: allPasswords[7],
      gender: 'female',
      bio: 'Passionate about literature, traveling, and trying new cuisines. Embracing diversity.',
    }, 7),
    createUser({
      displayName: 'Emily Wilson',
      username: 'emily_wilson',
      password: allPasswords[8],
      gender: 'female',
      bio: 'Bookworm, coffee lover, and aspiring world traveler. On a journey to explore the unknown.',
    }, 8),
    createUser({
      displayName: 'Chris Miller',
      username: 'chris_miller',
      password: allPasswords[9],
      gender: 'male',
      bio: 'Fitness fanatic and health advocate. Inspiring others to lead an active and balanced lifestyle.',
    }, 9),
    createUser({
      displayName: 'Eva Rodriguez',
      username: 'eva_rodriguez',
      password: allPasswords[10],
      gender: 'female',
      bio: 'Tech geek and aspiring entrepreneur. Building a future where innovation knows no bounds.',
    }, 10),
    createUser({
      displayName: 'Avery Taylor',
      username: 'avery_taylor',
      password: allPasswords[11],
      gender: 'female',
      bio: 'Passionate about social justice and creating a more inclusive world. Advocate for change.',
    }, 11),
    createUser({
      displayName: 'Jason Lam',
      username: 'jason_lam',
      password: allPasswords[12],
    }, 12),
    createUser({
      displayName: 'Jonathan Henry',
      username: 'jonathan_henry',
      password: allPasswords[13],
    }, 13),
    createUser({
      displayName: 'Justin Gate',
      username: 'justin_gate',
      password: allPasswords[14],
    }, 14),
    createUser({
      displayName: 'Hoki Tobayashi',
      username: 'hoki_tobayashi',
      password: allPasswords[15],
    }, 15),
    createUser({
      displayName: '丁诚',
      username: 'ding_cheng',
      password: allPasswords[16],
    }, 16),
    createUser({
      displayName: '吴晓严',
      username: 'xiaoyan',
      password: allPasswords[17],
    }, 17),
  ]);
}

async function createPostSampleDocuments() {
  console.log('Adding posts');
  await Promise.all([
    createPost({
      content:
          "Feeling overwhelmed today. Sometimes life hits you hard, and it's okay not to be okay.",
      user: users[0],
      isPublic: true,
      created: new Date('2023-10-10T14:50:00'),
      pat: [users[0], users[1], users[10], users[11]],
    }, 0),
    createPost({
      content:
          "Dealing with self-doubt. It's a tough battle, but I'll keep pushing forward. 💪",
      user: users[1],
      isPublic: true,
      created: new Date('2023-09-17T09:51:00'),
      pat: [users[0]],
    }, 1),
    createPost({
      content:
          "Navigating through a maze of emotions. It's okay to feel lost sometimes.",
      user: users[2],
      created: new Date('2022-11-14T13:02:12'),
    }, 2),
    createPost({
      content: 'Heartbroken and trying to make sense of it all.',
      user: users[3],
      created: new Date('2023-05-04T12:03:31'),
    }, 3),
    createPost({
      content: "Frustrated with setbacks, but I won't let them define me. Every obstacle is a stepping stone.",
      user: users[4],
      created: new Date('2022-12-05T08:52:12'),
    }, 4),
    createPost({
      content: "Struggling with self-doubt lately. It's tough when your inner critic is louder than any external voices.",
      user: users[0],
      isPublic: true,
      created: new Date('2023-03-06T09:19:41'),
    }, 5),
    createPost({
      content: "Feeling isolated and lonely. It's hard to connect with others when the weight of the world feels heavy.",
      user: users[0],
      created: new Date('2023-03-06T02:12:31'),
    }, 6),
    createPost({
      content: "Dealing with imposter syndrome at work. Constantly questioning my abilities and fearing I'll be exposed.",
      user: users[0],
      created: new Date('2023-03-19T11:41:12'),
    }, 7),
    createPost({
      content: "Feeling stuck in a cycle of negative thoughts. Trying to break free but it's easier said than done.",
      user: users[0],
      created: new Date('2023-04-28T15:21:35'),
    }, 8),
    createPost({
      content: 'Anxiety levels through the roof today. The smallest tasks feel like insurmountable challenges.',
      user: users[0],
      created: new Date('2023-01-11T19:24:55'),
    }, 9),
    createPost({
      content: "Overthinking every decision and fearing the consequences. The 'what ifs' are paralyzing.",
      user: users[0],
      created: new Date('2023-09-28T20:00:12'),
    }, 10),
    createPost({
      content: "Wrestling with a sense of inadequacy. It's exhausting trying to measure up to unrealistic standards.",
      user: users[0],
      created: new Date('2022-11-13T23:16:51'),
    }, 11),
    createPost({
      content: 'Feeling unappreciated and unnoticed. Everyone needs validation, and today it feels out of reach.',
      user: users[0],
      created: new Date('2022-09-11T23:54:12'),
    }, 12),
    createPost({
      content: 'Struggling with a sense of purpose. Wondering if what I do really matters in the grand scheme of things.',
      user: users[0],
      created: new Date('2021-05-12T23:17:28'),
    }, 13),
    createPost({
      content: 'Just finished a thrilling book! Any recommendations for the next one?',
      user: users[1],
      created: new Date('2021-06-25T21:23:53'),
    }, 14),
    createPost({
      content: "Feeling grateful for the little things in life. What's something that made your day better?",
      user: users[1],
      created: new Date('2021-07-08T22:12:51'),
    }, 15),
    createPost({
      content: 'Enjoying a peaceful weekend getaway. Sometimes, you just need a break.',
      user: users[1],
      created: new Date('2021-08-14T22:31:23'),
    }, 16),
    createPost({
      content: 'Trying out a new hobby – painting. It’s so therapeutic!',
      user: users[8],
      created: new Date('2021-09-02T15:29:21'),
    }, 17),
    createPost({
      content: 'Reflecting on the past year and setting goals for the next. What are your resolutions?',
      user: users[9],
      created: new Date('2021-12-30T18:31:32'),
    }, 18),
    createPost({
      content: 'Excited about my upcoming travel plans. Any travel enthusiasts here?',
      user: users[10],
      created: new Date('2022-03-10T16:31:43'),
    }, 19),
    createPost({
      content: 'Coding late into the night. The deadline is approaching, but I love the challenge!',
      user: users[10],
      created: new Date('2022-04-05T23:00:21'),
      pat: [users[0]],
    }, 20),
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
    [0, 8],
    [0, 9],
    [0, 10],
    [0, 11],
    [0, 12],
    [0, 17],
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

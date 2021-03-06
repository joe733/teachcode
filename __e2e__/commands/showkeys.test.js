'use strict';

const path = require('path');
const test = require('ava');
const fs = require('fs');

const { run } = require('../helpers/test-utils');

const workDir = path.join(__dirname, 'teachcode-solutions');
const configFilePath = path.join(workDir, 'config.json');

// Create the teachcode-solutions directory
test.before(() => fs.mkdirSync(workDir));

// Cleanup
test.after(() => fs.rmdirSync(workDir, { recursive: true }));

// Execute tests serially as we are creating different temp config files for each test
test.serial('no config file in the current path should error', async t => {
  const { exitCode, stderr } = await run(['showkeys'], {
    cwd: workDir,
    reject: false,
  });

  // Assertions
  // Exit code
  t.is(exitCode, 1);

  // Assert for the expected error message
  t.is(stderr.trim(), 'Could not find config.json in the current path!');
});

test.serial(
  'shows up an appropriate message if the user is getting started',
  async t => {
    const configWithoutKeys = {
      userName: 'configWithoutKeys',
      taskCount: 0,
      keys: [],
    };

    // Create config.json
    fs.writeFileSync(
      configFilePath,
      JSON.stringify(configWithoutKeys, null, 2),
    );
    const { exitCode, stdout } = await run(['showkeys'], {
      cwd: workDir,
    });

    // Assertions
    // Exit code
    t.is(exitCode, 0);

    // Displays user name and progress information
    t.true(stdout.includes('User: configWithoutKeys'));
    t.true(stdout.includes('Progress: 1/30'));

    // Assert for the expected message
    t.true(
      stdout
        .trim()
        .includes(
          'Looks like this is your very first task. Type in teachcode fetchtask to get started!',
        ),
    );
  },
);

test.serial('displays the respective keys for the submitted tasks', async t => {
  const configWithMultipleKeys = {
    userName: 'configWithMultipleKeys',
    taskCount: 2,
    keys: ['testkey1', 'testkey2'],
  };

  // Create config.json
  fs.writeFileSync(
    configFilePath,
    JSON.stringify(configWithMultipleKeys, null, 2),
  );
  const { exitCode, stdout } = await run(['showkeys'], { cwd: workDir });

  // Assertions
  // Exit code
  t.is(exitCode, 0);

  // Displays completed tasks and the corresponding keys
  t.true(stdout.includes('Task-1: testkey1'));
  t.true(stdout.includes('Task-2: testkey2'));

  // Displays user name and progress information
  t.true(stdout.includes('User: configWithMultipleKeys'));
  t.true(stdout.includes('Progress: 3/30'));
});

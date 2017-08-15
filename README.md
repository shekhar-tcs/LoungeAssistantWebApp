# TrackMyTools

### Deployment Configs


|   | Alpha  | Production |
|---|---|---|
|  Heroku Git URL | https://git.heroku.com/alpha-nonpoolaog.git  |  https://git.heroku.com/nonpool-aog.git |
| env.NODE_ENV  |  test | production  |

to support socket.io on heroku, run:
[heroku features:enable http-session-affinity](https://devcenter.heroku.com/articles/node-websockets#option-2-socket-io)




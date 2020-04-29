import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Button from "@material-ui/core/Button";
import Select from "react-select";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { ApolloProvider } from "@apollo/react-hooks";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Divider from "@material-ui/core/Divider";
import Footer from "./Footer";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";

import Avatar from 'react-avatar';
import {
  fade,
  withStyles,
  makeStyles,
  createMuiTheme,
} from "@material-ui/core/styles";
import { useDebounce, useDebounceCallback } from "@react-hook/debounce";
import ApolloClient from "apollo-boost";

import God from "./God";

const client = new ApolloClient({
  uri: "/graphql",
});
const useStyles = makeStyles((theme) => ({
  margin: {
    //margin: theme.spacing(1),
  },
  table: {
    minWidth: 450,
  },
  title: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const GET_PLAYERS = gql`
  {
    players {
      id
      name
      isEmpty
    }
  }
`;

const GET_ROLES = gql`
  {
    roles {
      id
      name
      number
    }
    players {
      id
      name
      roleName
      isEmpty
    }
  }
`;

const GET_PLAYER = gql`
  query GetPlayer($id: Int!, $pass: String!) {
    player(id: $id, pass: $pass) {
      id
      name
    }
  }
`;

const GET_PLAYER_INFO = gql`
  query GetPlayer($id: Int!, $pass: String!) {
    player(id: $id, pass: $pass) {
      id
      name
      roleName
    }
    players {
      id
      name
      isEmpty
    }
  }
`;

const UPDATE_ROLE_NUMBER = gql`
  mutation UpdateRoleNumber($id: Int!, $number: Int!) {
    updateRoleNumber(id: $id, number: $number)
  }
`;

const UPDATE_PLAYER_PASS = gql`
  mutation UpdatePlayerPass($id: Int!, $pass: String!) {
    updatePlayerPass(id: $id, pass: $pass) {
      isValid
      name
    }
  }
`;

const UPDATE_PLAYER_NAME = gql`
  mutation UpdatePlayerName($id: Int!, $name: String!) {
    updatePlayerName(id: $id, name: $name)
  }
`;

const GENERATE_ROLE = gql`
  mutation GenerateRole {
    generateRole
  }
`;

const GENERATE_PLAYER = gql`
  mutation GeneratePlayer {
    generatePlayer
  }
`;

const REMOVE_ALL_PLAYER = gql`
  mutation RemoveAllPlayer {
    removeAllPlayer
  }
`;

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function SimpleTable(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>角色</TableCell>

            <TableCell align="right">人數</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function PlayerTable(props) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>

            <TableCell align="right">玩家</TableCell>
            <TableCell align="right">角色</TableCell>
            <TableCell align="right">上線</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data.map((row) => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.id}
              </TableCell>
              <TableCell align="right">{row.name}</TableCell>
              <TableCell align="right">{row.roleName}</TableCell>
              <TableCell align="right">
                <span
                  style={{
                    color: row.isEmpty ? "gray" : "lightgreen",
                    transition: "all .3s ease",
                    fontSize: "24px",
                    marginRight: "10px",
                  }}
                >
                  &#x25cf;
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

function Player(props) {
  const classes = useStyles();

  const { loading, error, data } = useQuery(GET_PLAYER_INFO, {
    fetchPolicy: "network-only",
    variables: { id: props.id, pass: props.pass },
    pollInterval: 500,
  });

  console.log(props);

  const [value, setValue] = useDebounce(props.name, 500);
  const [name, setName] = React.useState(props.name);
  const [updatePlayerName, { called }] = useMutation(UPDATE_PLAYER_NAME);

  React.useEffect(() => {
    if (value && (value !== props.name || called)) {
      updatePlayerName({
        variables: { id: props.id, name: value },
      });
    }
  }, [value]);

  if (loading) {
    return <div>Loading</div>;
  }

  console.log(data.player);
  const { id, name: playerName, roleName } = data.player;
  return (
    <div style={{ marginTop: 120 }}>
      <TextField
        id="standard-basic"
        label="姓名"
        variant="outlined"
        className={classes.margin}
        margin="dense"
        value={name}
        onChange={(e) => {
          setValue(e.target.value);
          setName(e.target.value);
        }}
      />
      <Card className={classes.root}>
        <CardContent>
          <Typography variant="h1" component="h1">
            {roleName}
          </Typography>
        </CardContent>
      </Card>
      <PlayerTable data={data.players} />
    </div>
  );
}

function Login() {
  const classes = useStyles();

  const [playerId, setPlayerId] = React.useState(-1);
  const [playerPass, setPlayerPass] = React.useState("");
  const { loading, error, data } = useQuery(GET_PLAYERS);
  const [updatePlayerPass, playerStatus] = useMutation(UPDATE_PLAYER_PASS);
  const [isValidPlayerStatus, setIsValidPlayerStatus] = React.useState(false);
  if (loading || playerStatus.loading) {
    return <div>Loading</div>;
  }

  //if (playerStatus.data)

  if (
    playerStatus.called &&
    playerStatus.data.updatePlayerPass.isValid &&
    isValidPlayerStatus
  ) {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container>
          <AppBar position="absolute">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" className={classes.title}>
                小狼狼
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  setIsValidPlayerStatus(false);
                }}
              >
                退出
              </Button>
            </Toolbar>
          </AppBar>

          {
            <div style={{ marginTop: 10 }}>
              {playerId === 0 ? (
                <God />
              ) : (
                <Player
                  id={playerId}
                  pass={playerPass}
                  name={playerStatus.data.updatePlayerPass.name}
                />
              )}
            </div>
          }
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </React.Fragment>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div style={{ marginTop: "20%" }}>
      <Avatar round={true} src="wolf-login.png"/>
        <Autocomplete
          fullWidth
          id="combo-box-demo"
          className={classes.margin}
          options={data.players}
          getOptionLabel={(option) => `玩家 ${option.id}`}
          renderOption={(option) => (
            <React.Fragment>
              <span
                style={{
                  color: option.isEmpty ? "gray" : "lightgreen",
                  transition: "all .3s ease",
                  fontSize: "24px",
                  marginRight: "10px",
                }}
              >
                &#x25cf;
              </span>
              {` 玩家 ${option.id}`}
            </React.Fragment>
          )}
          onChange={(event, newValue) => {
            setPlayerId(newValue.id);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="玩家"
              variant="outlined"
              margin="dense"
            />
          )}
        />

        <TextField
          fullWidth
          id="standard-basic"
          label="密碼"
          variant="outlined"
          className={classes.margin}
          margin="dense"
          onChange={(e) => setPlayerPass(e.target.value)}
          value={playerPass}
        />
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => {
              updatePlayerPass({
                variables: { id: playerId, pass: playerPass },
              });
              setIsValidPlayerStatus(true);
            }}
          >
            登入
          </Button>
      </div>

      
      <Box mt={8}>
        <Copyright />
      </Box>
    </Container>
  );
}

function App() {
  return (
    <div className="App">
      <ApolloProvider client={client}>
        <Login />
      </ApolloProvider>
    </div>
  );
}

export default App;

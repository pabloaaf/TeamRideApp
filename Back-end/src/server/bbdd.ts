import * as mysql from 'mysql';
import {Car} from './models/modelCars';
import {TripCars, TripPlayers, Historic} from './models/modelHistoric';
import {Register} from './models/modelLogReg';
import {Pavilion} from './models/modelPavilions';
import {Player} from './models/modelPlayers';
import {Team} from './models/modelTeams';

class bbdd {
	private conexion;

	constructor() {
		this.conexion = this.crearConexion();
	}

	//******************* TOKEN ********************

	public verifyUniqueToken(token: string) {
		return new Promise((resolve, reject) => {
			this.conexion.query('SELECT * FROM tokens WHERE token = "'+token+'";', 
				function (err, result) {
					if (err) return reject(err);
					console.log(result);
					if(result.length == 0 ) {
						resolve(true);
					} else {
						resolve(false);
					}
				});
		});
	}

	public addToken(token:string) {//agregar token
		return new Promise((resolve, reject) => {
			this.conexion.query('INSERT INTO tokens (token) VALUES (\''+ token +'\');', 
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}


	//******************* CONEXION ********************

	private crearConexion() {
		let con = mysql.createConnection({
			host: 'localhost',
			user: 'root',
			password: 'cuatrovalles',
			database: 'db_softwareii'
		});
		con.connect(function(err) {
			if (err) throw err;
			console.log('Conected to bd');
		});
		return con;
	}

	//+++++++++++++++  USUARIOS  ++++++++++++++++++

	public login(email:string, password:string) {
		return new Promise((resolve, reject) => {
			this.conexion.query('SELECT * FROM players WHERE email = "'+email+'" AND password = "'+password+'";', 
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public checkRegisterPlayer(player:Player) {
		return new Promise((resolve, reject) => {
			this.conexion.query('SELECT * FROM players WHERE team = "'+player.team+'" AND dorsal = "'+player.dorsal+'";',
				function (err, result) {
					if (result == null || err) return reject(err); //devuelve que existe el jugador
					resolve(result); //devuelve que se query resulto vacia
				});
		});
	}

	public register(player:Player) {//update jugador existente
		return new Promise((resolve, reject) => {
			this.conexion.query('UPDATE players SET email = "'+player.email+'", password = "'+player.password+'" WHERE team = "'+player.team+'" AND dorsal = '+player.dorsal+'";',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public registerNewPlayer(player:Player) {//crear nuevo player
		return new Promise((resolve, reject) => {
			this.conexion.query('INSERT INTO players (team, name, nick, dorsal, debt, email, password) VALUES (\''+ player.team +'\', \''+ player.name +'\', \''+ player.nick +'\', \''+ player.dorsal +'\', \'0\', \''+ player.email +'\', \''+ player.password +'\');', 
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	//+++++++++++++++  TEAM  ++++++++++++++++++

	public infoTeams() {
		return new Promise((resolve, reject) => {
			this.conexion.query('SELECT name FROM teams;', //devolver el nombre de todos los equipos
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public addTeam(team:Team) {
		console.log(name);
		return new Promise((resolve, reject) => {
			this.conexion.query('INSERT INTO teams (name) VALUES (\''+ team.name +'\');', //añade un nuevo team
				(err, result) => {
					if (err) reject(err);
					resolve(result);
				});
		});
	}

	public infoTeam(team: string) { //Devolver jugadores de ese equipo
		return new Promise((resolve, reject) => {
			this.conexion.query('SELECT * FROM players WHERE team = \''+ team +'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	/*public updateTeam(oldName: string, newName: string) {
		return new Promise((resolve, reject) => {
			this.conexion.query('UPDATE teams SET name=\''+ newName +'\' WHERE name=\''+oldName+'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}*/

	//+++++++++++++++  CARS  ++++++++++++++++++

	public infoCars(team:string) { //supongo que será sacar una lista de los coches de cierto equipo
		return new Promise((resolve, reject) => { //ToDo
			this.conexion.query('SELECT * FROM cars WHERE team=\''+team+'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public addCar(car:Car) {
		return new Promise((resolve, reject) => {
			this.conexion.query('INSERT INTO cars (ownerId, owner, team, spendingGas,gasPrice, model, seats) VALUES (\''+ car.ownerID +'\', \''+ car.owner +'\', \''+ car.team +'\', \''+ car.spendingGas +'\', \''+car.gasPrice+'\', \''+ car.model +'\', \''+car.seats+'\');',
				(err, result) => {
					if (err) reject(err);
					resolve(result);
				});
		});
	}

	public updateCarId(car:Car) {
		return new Promise((resolve, reject) => {
			this.conexion.query('UPDATE cars SET spendingGas=\''+car.spendingGas+'\', gasPrice=\''+car.gasPrice+'\', model=\''+car.model+'\', seats=\''+car.seats+'\' WHERE id = '+car.id+';', 
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public deleteCarId(car: Car) {
		return new Promise((resolve, reject) => {
			this.conexion.query('DELETE FROM cars WHERE id= \''+ car.id +'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public getInfoCarId(id: number) {
		console.log("getInfoCar", id);
		return new Promise((resolve, reject) => {
			this.conexion.query('SELECT * FROM cars WHERE id= \''+ id +'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}
	


	//+++++++++++++++  PLAYERS  ++++++++++++++++++

	public infoPlayers(team:string) {
		return new Promise((resolve, reject) => {
			if(team == "") return reject("No se especifica el equipo");
			this.conexion.query('SELECT * FROM players WHERE team= \''+team+'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public addPlayer(player:Player) { //agregar un jugador, que no esta registrado
		console.log(name);
		return new Promise((resolve, reject) => {
			this.conexion.query('INSERT INTO players (team, name, nick, dorsal, debt) VALUES (\''+ player.team +'\', \''+ player.name +'\', \''+ player.nick +'\', \''+ player.dorsal +'\', \'0\');',
				(err, result) => {
					if (err) reject(err);
					resolve(result);
				});
		});
	}

	public updatePlayer(player:Player) {
		return new Promise((resolve, reject) => {
			this.conexion.query('UPDATE players SET name=\''+player.name+'\', dorsal='+player.dorsal+', nick=\''+player.nick+'\' WHERE id = '+player.id+';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public deletePlayer(player:Player) {
		return new Promise((resolve, reject) => {
			this.conexion.query('DELETE FROM players WHERE id= \''+ player.id +'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public getPlayerId(id:number){
		return new Promise((resolve, reject) => {
			this.conexion.query('SELECT * FROM players WHERE id= \''+id+'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});

	}

	//+++++++++++++++  PAVILIONS  ++++++++++++++++++

	public infoPavilions(team: string) {
		return new Promise((resolve, reject) => {
			this.conexion.query('SELECT * FROM pavilions WHERE team = \''+ team +'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public addPavilion(pavilion:Pavilion) {
		console.log(pavilion);
		return new Promise((resolve, reject) => {
			this.conexion.query('INSERT INTO pavilions (team, pavilion, distance) VALUES (\''+ pavilion.team +'\', \''+ pavilion.pavilion +'\', \''+ pavilion.distance +'\');', 
				(err, result) => {
					if (err) reject(err);
					resolve(result);
				});
		});
	}

	public updatePavilion(pavilion:Pavilion) {
		return new Promise((resolve, reject) => {
			this.conexion.query('UPDATE pavilions SET pavilion=\''+ pavilion.pavilion +'\', distance=\''+ pavilion.distance +'\' WHERE id=\''+pavilion.id+'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public deletePavilion(pavilion:Pavilion) {
		return new Promise((resolve, reject) => {
			this.conexion.query('DELETE FROM pavilions WHERE id= \''+ pavilion.id +'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public getPavilionDistance(pavilionId:number, team:string){
		return new Promise((resolve, reject) => {
			console.log(pavilionId + team)
			this.conexion.query('SELECT distance FROM pavilions WHERE id= \''+ pavilionId +'\' AND team= \''+ team +'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	//+++++++++++++++  CERRAR  ++++++++++++++++++

	private close() {
		return new Promise( (resolve, reject) => {
			this.conexion.end(err => {
				if(err) return reject(err);
				resolve();
			});
		});
	}


	//+++++++++++++++  HISTORIC  ++++++++++++++++++


	public addHistoric(historic: Historic) {
		return new Promise((resolve, reject) => {
			if(historic.team == "") return reject("No se especifica el equipo");
			console.log(historic.date);
			this.conexion.query('INSERT INTO historic (date, team, pavilionId) VALUES (\''+ historic.date +'\', \''+ historic.team +'\', \''+ historic.pavilionId +'\' );',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public addTripCar(trip: TripCars) {
		return new Promise((resolve, reject) => {
				this.conexion.query('INSERT INTO tripCars (date, team, carId) VALUES (\''+ trip.date +'\', \''+ trip.team +'\', \''+ trip.carId +'\');',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}
	public addTripPlayer(trip:TripPlayers) {
		return new Promise((resolve, reject) => {
				this.conexion.query('INSERT INTO tripPlayers (date, team, playerId) VALUES (\''+ trip.date +'\', \''+ trip.team +'\', \''+ trip.playerId +'\');',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	
	public getHistoric(historic:Historic, numData:number) {
		return new Promise((resolve, reject) => {
			if(historic.team == "") return reject("No se especifica el equipo");
			this.conexion.query('SELECT * FROM historic WHERE team = \''+historic.team+'\' ORDER BY date DESC LIMIT '+numData+';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public getTripCars(trip: TripCars) {
		return new Promise((resolve, reject) => {
			if(trip.team == "" || trip.date == "" ) return reject("No se especifica el equipo o la fecha");
			this.conexion.query('SELECT * FROM tripCars WHERE team = \''+trip.team+'\' AND date="'+trip.date+'";',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public getTripPlayers(trip: TripPlayers) {
		return new Promise((resolve, reject) => {
			if(trip.team == "" || trip.date == "" ) return reject("No se especifica el equipo o la fecha");
			this.conexion.query('SELECT * FROM tripPlayers WHERE team = \''+trip.team+'\' AND date="'+trip.date+'";',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}


	//++++++++++++++++ DEBT +++++++++++++++++++
	
	public updatePlayerDebt(playerId:number, debt:number){
		console.log("UpdatePlayerDebt", playerId, debt);		
		return new Promise((resolve, reject) => {
			this.conexion.query('UPDATE players SET debt = \''+debt+'\' WHERE id= \''+playerId+'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}

	public getPlayerDebt(playerId:number){
		console.log("getPlayerDebt", playerId);		
		return new Promise((resolve, reject) => {
			this.conexion.query('SELECT * FROM players WHERE id= \''+playerId+'\';',
				function (err, result) {
					if (err) return reject(err);
					resolve(result);
				});
		});
	}
}
export default new bbdd();
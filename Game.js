import Render from "./Render.js";
import Monster from "./MonsterEntity.js";
import Skeleton from "./SkeletonEntity.js";
import PlayerEntity from "./PlayerEntity.js";

export default class Game {
    constructor() {
        this.gridHolder = $('#gridHolder');
        this.mainLayer = $('#mainLayer');
        this.gridInfoHolder = $('#gridInformationHolder');
        this.turnInfo = $('#turnInfo');
        this.gameInfo = {
            turn: 1,
            isPlayerTurn: false,
            isEnemyTurn: false,
        };
        this.randomDoorLocations = {
            in: Math.floor((Math.random() * 11) + 1),
            out: Math.floor((Math.random() * 11) + 1)
        };

        this.render = new Render();

        this.gridInfoHolder.addClass('hidden');

        this.generateGrid();
        this.setTurn();

        this.numberOfEnemies = Math.floor(Math.random() * 5 + 1);

        this.setupEnemies(this.numberOfEnemies);

        this.player = new PlayerEntity(this.randomDoorLocations.in);
        this.render.renderEntity(this.player);
        console.log(this.player);

        //listeners
        $(window).resize(() => {
            this.checkScreenSize();
        });
        $('.grid-block').click((e)=> {
            this.showGridInfo(e);
        });
        //end of listeners
    }

    generateGrid = () => {    
        for(let i = 0; i < 13; ++i) {
            for(let j = 0; j < 13; ++j) {
                let gridBlockDiv = $("<div class='grid-block'></div>");
                
                gridBlockDiv = this.setupWall(gridBlockDiv, i, j, this.randomDoorLocations);
                
                gridBlockDiv.attr('id', i+"-"+j);
                this.gridHolder.append(gridBlockDiv);
            }
        }
    }

    setupWall = (gridDiv, coordX, coordY, doors) => {
        if(
            (coordX === 0 && coordY !== doors.out) || 
            (coordX === 12 && coordY !== doors.in) || 
            (coordY === 0 || coordY === 12)
        ) {
            gridDiv.addClass('wall');
        }
    
        return gridDiv;
    }

    checkScreenSize = () => {
        if(window.innerHeight < 802 || window.innerWidth < 992) {
            this.mainLayer.addClass('hidden');
            this.showMessageBox("This game can not be used smaller than a 802x992 (HxW) screen! :(", true);
        }else{
            this.mainLayer.removeClass('hidden');
            this.showMessageBox("", false);
        }
    }

    showMessageBox = (message, show) => {
        const box = $('#messageBox');
        $('#messageBody').text(message);
        if(show === true) {
            box.removeClass('hidden');
        }else{
            box.addClass('hidden');
        }
    }

    showGridInfo = (e) => {
        $('.grid-block').map((i,e) => $(e).removeClass('selectedGrid'));

        const div = e.currentTarget;
        const occupantDiv = $('#occupantInfo');

        if(!$(div).hasClass('wall')) {
            const x = $(div).attr('id').split('-')[0];
            const y = $(div).attr('id').split('-')[1];
    
            $('#gridPos').text("X: " + x + "; Y: " + y);
        
            $(div).addClass('selectedGrid');
    
            this.gridInfoHolder.removeClass('hidden');
            occupantDiv.text("");

            if($(e.target).hasClass('entity')) {
                const entityID = parseInt($(e.target).attr('id'));
    
                const entityData = this.render.getEntityByID(entityID);
    
                let occupantInfoString = `
                    <p>Entity: <b>${entityData.getEntityType()}(${entityData.getEntityID()})</b>.</p>
                    <p>Health: ${entityData.getHealth()} / ${entityData.getbaseHealth()}</p>
                    <p>Attack DMG: ${entityData.getAttack()}</p>
                `;
                occupantDiv.append(occupantInfoString);
            }else {
                occupantDiv.text("");
            }
        }else{
            this.gridInfoHolder.addClass('hidden');
        }
    }

    setTurn = () => {
        this.turnInfo.text("Turn " + this.gameInfo.turn);
    }

    spawnEnemy = (type) => {
        let entity = (type === 0) ? new Skeleton() : new Monster();
        this.render.initRenderEntity(entity);
        entity.setIsSpawned(true);
    }

    setupEnemies = (num) => {
        for(let i = 0; i <= num; ++i) {
            const type = Math.floor(Math.random() * 2);
            
            this.spawnEnemy(type);
            
        }
    }


}
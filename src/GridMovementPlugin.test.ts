import * as Phaser from "phaser";
import { Direction } from "./Direction/Direction";
import { GridCharacter } from "./GridCharacter/GridCharacter";
const mockSetTilePositon = jest.fn();
const mockMove = jest.fn();
const mockUpdate = jest.fn();
jest.mock("./GridCharacter/GridCharacter", function () {
  return {
    GridCharacter: jest.fn((id) => {
      return {
        setTilePosition: mockSetTilePositon,
        move: mockMove,
        update: mockUpdate,
        getId: () => id,
      };
    }),
  };
});

import { GridMovementPlugin } from "./GridMovementPlugin";

describe("GridMovementPlugin", () => {
  let gridMovementPlugin: GridMovementPlugin;
  let sceneMock;
  let pluginManagerMock;
  let tileMapMock;
  let playerSpriteMock;

  beforeEach(() => {
    // hacky way of avoiding errors in Plugin Initialization because Phaser
    // is not mockable by jest
    sceneMock = { sys: { events: { once: jest.fn(), on: jest.fn() } } };
    pluginManagerMock = {};
    tileMapMock = {
      layers: [
        {
          tilemapLayer: { scale: 2 },
        },
      ],
      tileWidth: 16,
    };
    playerSpriteMock = {};
  });

  it("should boot", () => {
    gridMovementPlugin = new GridMovementPlugin(sceneMock, pluginManagerMock);
    gridMovementPlugin.boot();
    expect(sceneMock.sys.events.on).toHaveBeenCalledWith(
      "update",
      gridMovementPlugin.update,
      gridMovementPlugin
    );
  });

  it("should init player", () => {
    gridMovementPlugin = new GridMovementPlugin(sceneMock, pluginManagerMock);
    gridMovementPlugin.create(playerSpriteMock, tileMapMock);
    expect(GridCharacter).toHaveBeenCalledWith(
      "player",
      playerSpriteMock,
      6,
      32,
      tileMapMock,
      4
    );
    expect(mockSetTilePositon).toHaveBeenCalledWith(
      new Phaser.Math.Vector2(0, 0)
    );
  });

  it("should use config startPosition", () => {
    gridMovementPlugin = new GridMovementPlugin(sceneMock, pluginManagerMock);
    gridMovementPlugin.create(playerSpriteMock, tileMapMock, {
      startPosition: new Phaser.Math.Vector2(3, 4),
    });
    expect(mockSetTilePositon).toHaveBeenCalledWith(
      new Phaser.Math.Vector2(3, 4)
    );
  });

  it("should use config speed", () => {
    gridMovementPlugin = new GridMovementPlugin(sceneMock, pluginManagerMock);
    gridMovementPlugin.create(playerSpriteMock, tileMapMock, {
      speed: 2,
    });
    expect(GridCharacter).toHaveBeenCalledWith(
      "player",
      playerSpriteMock,
      6,
      32,
      tileMapMock,
      2
    );
  });

  it("should move player left", () => {
    gridMovementPlugin = new GridMovementPlugin(sceneMock, pluginManagerMock);
    gridMovementPlugin.create(playerSpriteMock, tileMapMock);

    gridMovementPlugin.movePlayerLeft();

    expect(mockMove).toHaveBeenCalledWith(Direction.LEFT);
  });

  it("should move player right", () => {
    gridMovementPlugin = new GridMovementPlugin(sceneMock, pluginManagerMock);
    gridMovementPlugin.create(playerSpriteMock, tileMapMock);

    gridMovementPlugin.movePlayerRight();

    expect(mockMove).toHaveBeenCalledWith(Direction.RIGHT);
  });

  it("should move player up", () => {
    gridMovementPlugin = new GridMovementPlugin(sceneMock, pluginManagerMock);
    gridMovementPlugin.create(playerSpriteMock, tileMapMock);

    gridMovementPlugin.movePlayerUp();

    expect(mockMove).toHaveBeenCalledWith(Direction.UP);
  });

  it("should move player down", () => {
    gridMovementPlugin = new GridMovementPlugin(sceneMock, pluginManagerMock);
    gridMovementPlugin.create(playerSpriteMock, tileMapMock);

    gridMovementPlugin.movePlayerDown();

    expect(mockMove).toHaveBeenCalledWith(Direction.DOWN);
  });

  it("should update", () => {
    gridMovementPlugin = new GridMovementPlugin(sceneMock, pluginManagerMock);
    gridMovementPlugin.create(playerSpriteMock, tileMapMock);

    gridMovementPlugin.update(123, 456);

    expect(mockUpdate).toHaveBeenCalledWith(456);
  });
});
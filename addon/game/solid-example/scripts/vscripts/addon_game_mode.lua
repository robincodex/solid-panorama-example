--[[
Author: du 1149464651@qq.com
Date: 2022-11-25 14:14:40
LastEditors: du 1149464651@qq.com
LastEditTime: 2022-12-04 00:22:38
FilePath: \solid-panorama-example\addon\game\solid-example\scripts\vscripts\addon_game_mode.lua
Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
--]]
-- Generated from template

if CAddonTemplateGameMode == nil then
	CAddonTemplateGameMode = class({})
end

function Precache( context )
	--[[
		Precache things we know we'll use.  Possible file types include (but not limited to):
			PrecacheResource( "model", "*.vmdl", context )
			PrecacheResource( "soundfile", "*.vsndevts", context )
			PrecacheResource( "particle", "*.vpcf", context )
			PrecacheResource( "particle_folder", "particles/folder", context )
	]]
end
print('GameRules.EquipList ', 1111111 )
-- Create the game mode when we activate
function Activate()
	GameRules.AddonTemplate = CAddonTemplateGameMode()
	GameRules.AddonTemplate:InitGameMode()
end

function CAddonTemplateGameMode:InitGameMode()
	print( "Template addon is loaded." )
	GameRules:GetGameModeEntity():SetThink( "OnThink", self, "GlobalThink", 2 )
	-- 添加物品
	ListenToGameEvent("player_chat",Dynamic_Wrap(CAddonTemplateGameMode,"OnPlayerChat"),self)
end

-- Evaluate the state of the game
function CAddonTemplateGameMode:OnThink()
	if GameRules:State_Get() == DOTA_GAMERULES_STATE_GAME_IN_PROGRESS then
		--print( "Template addon script is running." )
	elseif GameRules:State_Get() >= DOTA_GAMERULES_STATE_POST_GAME then
		return nil
	end
	return 1
end
-- 添加物品
function CAddonTemplateGameMode:OnPlayerChat(event)
    --PrintTable(event)
    --[[
matchid=	12635
  {
    playerid = 0
    text = -debug
    teamonly = 1
    userid = 1
    splitscreenplayer = -1
  }
    ]]
    local tokens =  string.lower(event.text)
    print("OnPlayerChat :",tokens)
    if tokens == "item" then
		print("OnPlayerChat :1111111111111111",tokens)
		local newItem = CreateItem("item_blink", nil, nil )
		local hero = PlayerResource:GetPlayer(event.playerid):GetAssignedHero()
		-- newItem:LaunchLoot( false, 200, 0.75, hero:GetOrigin() )
		CreateItemOnPositionSync(hero:GetAbsOrigin(), newItem);

    end
end

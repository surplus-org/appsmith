import type { ReactNode } from "react";
import React, { useCallback } from "react";
import { Menu, MenuItem, MenuContent, MenuTrigger } from "@appsmith/ads";
import { useSelector, useDispatch } from "react-redux";
import { setIsGitSyncModalOpen } from "actions/gitSyncActions";
import { GitSyncModalTab } from "entities/GitSync";
import AnalyticsUtil from "ee/utils/AnalyticsUtil";
import {
  CONNECT_TO_GIT_OPTION,
  CURRENT_DEPLOY_PREVIEW_OPTION,
} from "ee/constants/messages";
import { Button } from "@appsmith/ads";
import { KBEditorMenuItem } from "ee/pages/Editor/KnowledgeBase/KBEditorMenuItem";
import { useHasConnectToGitPermission } from "pages/Editor/gitSync/hooks/gitPermissionHooks";
import { getIsAnvilEnabledInCurrentApplication } from "layoutSystems/anvil/integrations/selectors";
import {
  useGitConnected,
  useGitModEnabled,
} from "pages/Editor/gitSync/hooks/modHooks";
import { GitDeployMenuItems as GitDeployMenuItemsNew } from "git";

function GitDeployMenuItems() {
  const isGitModEnabled = useGitModEnabled();

  const dispatch = useDispatch();
  const goToGitConnectionPopup = useCallback(() => {
    AnalyticsUtil.logEvent("GS_CONNECT_GIT_CLICK", {
      source: "Deploy button",
    });

    dispatch(
      setIsGitSyncModalOpen({
        isOpen: true,
        tab: GitSyncModalTab.GIT_CONNECTION,
      }),
    );
  }, [dispatch]);

  return isGitModEnabled ? (
    <GitDeployMenuItemsNew />
  ) : (
    <MenuItem
      className="t--connect-to-git-btn"
      onClick={goToGitConnectionPopup}
      startIcon="git-branch"
    >
      {CONNECT_TO_GIT_OPTION()}
    </MenuItem>
  );
}

interface Props {
  trigger: ReactNode;
  link: string;
}

export const DeployLinkButton = (props: Props) => {
  const isGitConnected = useGitConnected();
  const isConnectToGitPermitted = useHasConnectToGitPermission();
  // We check if the current application is an Anvil application.
  // If it is an Anvil application, we remove the Git features from the deploy button
  // as they donot yet work correctly with Anvil.
  const isAnvilEnabled = useSelector(getIsAnvilEnabledInCurrentApplication);

  return (
    <Menu>
      <MenuTrigger>
        <Button
          className="t--deploy-popup-option-trigger"
          isIconButton
          kind="tertiary"
          size="md"
          startIcon={"down-arrow"}
        />
      </MenuTrigger>
      <MenuContent>
        {!isGitConnected && isConnectToGitPermitted && !isAnvilEnabled && (
          <GitDeployMenuItems />
        )}
        <MenuItem
          className="t--current-deployed-preview-btn"
          onClick={() => {
            if (window) {
              window.open(props.link, "_blank")?.focus();
            }
          }}
          startIcon="share-box-line"
        >
          {CURRENT_DEPLOY_PREVIEW_OPTION()}
        </MenuItem>
        <KBEditorMenuItem />
      </MenuContent>
    </Menu>
  );
};

export default DeployLinkButton;

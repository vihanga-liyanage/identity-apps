/**
 * Copyright (c) 2020, WSO2 Inc. (http://www.wso2.org) All Rights Reserved.
 *
 * WSO2 Inc. licenses this file to you under the Apache License,
 * Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied. See the License for the
 * specific language governing permissions and limitations
 * under the License
 */

import { AlertLevels, RolesInterface } from "@wso2is/core/models";
import { addAlert } from "@wso2is/core/store";
import React, { FunctionComponent, ReactElement } from "react"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateRolePermissions, updateRole } from "../../api";
import { Permission } from "../../models";
import { PermissionList } from "../wizard";

/**
 * Interface to capture permission edit props.
 */
interface RolePermissionDetailProps {
    roleObject: RolesInterface;
    isGroup: boolean;
    onRoleUpdate: () => void;
    isReadOnly?: boolean;
}

/**
 * Component to update permissions of the selected role.
 * @param props Contains role id to get permission details.
 */
export const RolePermissionDetails: FunctionComponent<RolePermissionDetailProps> = (props:
    RolePermissionDetailProps): ReactElement => {

    const { t } = useTranslation();
    const dispatch = useDispatch();

    const {
        roleObject,
        onRoleUpdate,
        isGroup
    } = props;

    const onPermissionUpdate = (updatedPerms: Permission[]) => {
        const roleData = {
            "Operations": [ {
                "op": "replace",
                "path": "permissions",
                "value": updatedPerms.map(perm => perm.fullPath)
            } ],
            "schemas": [ "urn:ietf:params:scim:api:messages:2.0:PatchOp" ]
        };
        updateRole(roleObject.id, roleData)
            .then(() => {
                dispatch(
                    addAlert({
                        description: isGroup
                            ? t("adminPortal:components.groups.notifications.updateGroup.success.description")
                            : t("adminPortal:components.roles.notifications.updateRole.success.description"),
                        level: AlertLevels.SUCCESS,
                        message: isGroup
                            ? t("adminPortal:components.groups.notifications.updateGroup.success.message")
                            : t("adminPortal:components.roles.notifications.updateRole.success.message")
                    })
                );
                onRoleUpdate();
            })
            .catch(error => {
                if (!error.response || error.response.status === 401) {
                    dispatch(
                        addAlert({
                            description: isGroup
                                ? t("adminPortal:components.groups.notifications.createPermission.error.description")
                                : t("adminPortal:components.roles.notifications.createPermission.error.description"),
                            level: AlertLevels.ERROR,
                            message: isGroup
                                ? t("adminPortal:components.groups.notifications.createPermission.error.message")
                                : t("adminPortal:components.roles.notifications.createPermission.error.message")
                        })
                    );
                } else if (error.response && error.response.data.detail) {
                    dispatch(
                        addAlert({
                            description: isGroup
                                ? t("adminPortal:components.groups.notifications.createPermission.error.description",
                                { description: error.response.data.detail })
                                : t("adminPortal:components.roles.notifications.createPermission.error.description",
                                { description: error.response.data.detail }),
                            level: AlertLevels.ERROR,
                            message: isGroup
                                ? t("adminPortal:components.groups.notifications.createPermission.error.message")
                                : t("adminPortal:components.roles.notifications.createPermission.error.message")
                        })
                    );
                } else {
                    dispatch(
                        addAlert({
                            description: isGroup
                                ? t("adminPortal:components.groups.notifications.createPermission.genericError."+
                                "description")
                                : t("adminPortal:components.roles.notifications.createPermission.genericError."+
                                "description"),
                            level: AlertLevels.ERROR,
                            message: isGroup
                                ? t("adminPortal:components.groups.notifications.createPermission.genericError."+
                                "message")
                                : t("adminPortal:components.roles.notifications.createPermission.genericError."+
                                "message")
                        })
                    );
                }
            })
    };

    return (
        <div className="permissions-edit-container">
            <PermissionList isEdit isRole onSubmit={ onPermissionUpdate } roleObject={ roleObject } />
        </div>
    )
};

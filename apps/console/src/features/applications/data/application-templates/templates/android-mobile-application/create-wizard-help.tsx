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
 * under the License.
 */

import { TestableComponentInterface } from "@wso2is/core/models";
import { Heading } from "@wso2is/react-components";
import React, { FunctionComponent, ReactElement } from "react";
import { Divider } from "semantic-ui-react";

/**
 * Prop types of the component.
 */
type AndroidApplicationCreateWizardHelpPropsInterface = TestableComponentInterface

/**
 * Help content for the android mobile application template creation wizard.
 *
 * @param {AndroidApplicationCreateWizardHelpPropsInterface} props - Props injected into the component.
 * @return {React.ReactElement}
 */
const AndroidApplicationCreateWizardHelp: FunctionComponent<AndroidApplicationCreateWizardHelpPropsInterface> = (
    props: AndroidApplicationCreateWizardHelpPropsInterface
): ReactElement => {

    const {
        [ "data-testid" ]: testId
    } = props;

    return (
        <div data-testid={ testId }>
            <Heading as="h5">Name to identify your application</Heading>
            <p>A unique name for the application.</p>
            <p>E.g., My App</p>

            <Divider />

            <React.Fragment>
                <Heading as="h5">Authorized redirect URIs</Heading>
                <p>
                    The redirect URL determines where the authorization code is sent to
                    once the user is authenticated, and where the user is redirected to
                    once the logout is complete.
                </p>
                <p>E.g., https://myapp.io/login</p>
            </React.Fragment>
        </div>
    );
};

/**
 * Default props for the component
 */
AndroidApplicationCreateWizardHelp.defaultProps = {
    "data-testid": "android-app-create-wizard-help"
};

/**
 * A default export was added to support React.lazy.
 * TODO: Change this to a named export once react starts supporting named exports for code splitting.
 * @see {@link https://reactjs.org/docs/code-splitting.html#reactlazy}
 */
export default AndroidApplicationCreateWizardHelp;

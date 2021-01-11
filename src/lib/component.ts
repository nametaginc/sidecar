/**
 * Copyright 2020 Nametag Inc.
 *
 * All information contained herein is the property of Nametag Inc.. The
 * intellectual and technical concepts contained herein are proprietary, trade
 * secrets, and/or confidential to Nametag, Inc. and may be covered by U.S.
 * and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Reproduction or distribution, in whole or in part, is
 * forbidden except by express written permission of Nametag, Inc.
 */

import * as H from "history";
import * as React from "react";

export class ReactComponent<
  Params = {},
  State = {},
  LocationState = {}
> extends React.Component<Params, State> {
  async setStateAsync<K extends keyof State>(
    state: Pick<State, K>
  ): Promise<void> {
    return new Promise<void>((resolve) => {
      this.setState(state, () => {
        resolve();
      });
    });
  }
}

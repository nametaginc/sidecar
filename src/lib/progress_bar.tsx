/**
 * Copyright 2020 Groove ID, Inc.
 *
 * All information contained herein is the property of Groove ID, Inc. The
 * intellectual and technical concepts contained herein are proprietary, trade
 * secrets, and/or confidential to Groove ID, Inc. and may be covered by U.S.
 * and Foreign Patents, patents in process, and are protected by trade secret or
 * copyright law. Reproduction or distribution, in whole or in part, is
 * forbidden except by express written permission of Groove ID, Inc.
 */

import * as React from "react";
import BootstrapProgressBar from "react-bootstrap/ProgressBar";

interface ProgressProps {
  estimated: number;
  className?: string;
  style?: React.CSSProperties;
}

class ProgressState {
  startTime: Date;
  currentTime: Date;

  constructor() {
    this.startTime = new Date();
    this.currentTime = this.startTime;
  }
}

export class ProgressBar extends React.Component<ProgressProps, ProgressState> {
  intervalHandle?: number;

  constructor(props: ProgressProps) {
    super(props);
    this.state = new ProgressState();
  }
  componentDidMount() {
    this.intervalHandle = window.setInterval(() => {
      this.setState({ currentTime: new Date() });
    }, 100);
  }
  componentWillUnmount() {
    window.clearInterval(this.intervalHandle);
  }

  render() {
    let value;
    const elapsed =
      this.state.currentTime.getTime() - this.state.startTime.getTime();

    if (this.props.estimated) {
      if (elapsed < this.props.estimated) {
        value = (elapsed / this.props.estimated) * 80;
      } else {
        value = 80;
      }
    } else {
      value = (elapsed / 100) % 100;
    }
    return (
      <BootstrapProgressBar
        className={this.props.className}
        style={this.props.style}
        striped={true}
        now={value}
      />
    );
  }
}

interface ProgressSpinnerProps {
  className?: string;
  style?: React.CSSProperties;
}

export class ProgressSpinner extends React.Component<ProgressSpinnerProps> {
  render() {
    return <div className="spinner-border spinner-border-sm" role="status" />;
  }
}

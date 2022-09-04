import React from "react";

interface Props
    {
        isPaused: boolean;
        loading: boolean;
        mintAmount: number;
        decrementMintAmount(): void;
        incrementMintAmount(): void;
        mint(): Promise<void>;
    }

interface State
    {

    }

const defaultState: State = 
    {

    };

export default class MintWidget extends React.Component<Props, State> {
    constructor( props: Props ) {
        super( props );

        this.state = defaultState;
    }

    render() {
        return (
            <>
                <figure className={`${( this.props.loading || this.props.isPaused ) ? 'disabled' : ''}`}>
                    <button disabled={this.props.loading} onClick={() => this.props.decrementMintAmount()}>
                        <span>-</span>
                    </button>
                    <button disabled={this.props.loading} onClick={() => this.props.mint()}>
                        <span data-value={this.props.mintAmount}></span>
                    </button>
                    <button disabled={this.props.loading} onClick={() => this.props.incrementMintAmount()}>
                        <span>+</span>
                    </button>
                </figure>
            </>
        )
    }
}
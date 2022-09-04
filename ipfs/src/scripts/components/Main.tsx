import React from "react";
import { toast } from "react-toastify";

import { ethers, utils, BigNumber } from "ethers";
import { ExternalProvider, Web3Provider } from "@ethersproject/providers";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

const { default: Resolution } = require( "@unstoppabledomains/resolution" );

import NFTContractType from "../../../../dapp/src/scripts/lib/NFTContractType";
import Whitelist from "../../../../dapp/src/scripts/lib/Whitelist";

import CollectionConfig from "../../../../smart-contract/config/CollectionConfig";
import NetworkConfigInterface from "../../../../smart-contract/lib/NetworkConfigInterface";

import { infruaID } from "../../../../dapp/src/scripts/lib/API";

import MessageBox from "../../../../dapp/src/scripts/components/MessageBox";
import ConnectedWallet from "../../../../dapp/src/scripts/components/ConnectedWallet";
import MintWidget from "../../../../dapp/src/scripts/components/MintWidget";
import CollectionStatus from "../../../../dapp/src/scripts/components/CollectionStatus";
import Sample from "./Sample";
import Footer from "../../../../dapp/src/scripts/components/Footer";

const ContractAbi = require( `../../../../smart-contract/artifacts/contracts/Bagholderz.sol/Bagholderz.json` ).abi;

interface Props
    {

    }

interface State
    {
        displayPrice: string;
        ens: string|null;
        message: string|null;
        messageType: string|null;
        isPaused: boolean;
        isWhitelistMintEnabled: boolean;
        isUserInWhitelist: boolean;
        loading: boolean;
        maxMintAmountPerTx: number;
        maxSupply: number;
        mintAmount: number;
        network: ethers.providers.Network|null;
        networkConfig: NetworkConfigInterface;
        tokenPrice: BigNumber;
        totalSupply: number;
        uns: string|null;
        userAddress: string|null;
    }

const defaultState: State =
    {
        displayPrice: "0.1 ETH ",
        ens: null,
        message: null,
        messageType: null,
        isPaused: true,
        isWhitelistMintEnabled: false,
        isUserInWhitelist: false,
        loading: false,
        maxMintAmountPerTx: 0,
        maxSupply: 0,
        mintAmount: 1,
        network: null,
        networkConfig: CollectionConfig.mainnet,
        tokenPrice: BigNumber.from( 0 ),
        totalSupply: 0,
        uns: null,
        userAddress: null
    }

export default class MainDOM extends React.Component<Props, State>
    {
        contract!: NFTContractType;
        provider!: Web3Provider;
        web3Modal!: Web3Modal;

        constructor( props: Props )
            {
                super( props );

                this.state = defaultState;
            }

        componentDidMount = async () =>
            {

                const providerOptions = {
                    walletconnect:
                        {
                            package: WalletConnectProvider,
                            options:
                                {
                                    infuraId: infruaID,
                                    qrcodeModalOptions:
                                        {
                                            mobileLinks:
                                                [
                                                    "metamask",
                                                    "rainbow",
                                                    "trust"
                                                ]
                                        }
                                }
                        }
                };

                this.web3Modal = new Web3Modal({
                    network: "mainnet",
                    cacheProvider: false,
                    providerOptions
                });

            }

        private canMint(): boolean
            {
                return !this.state.isPaused || this.canWhitelistMint();
            }

        private canWhitelistMint(): boolean
            {
                return this.state.isWhitelistMintEnabled && this.state.isUserInWhitelist;
            }

        private checkChainID( chainID: number ): void
            {
                if( chainID !== 1 ) {

                    let network;
                    let msg;
                    
                    switch( chainID )
                        {
                            case 3:
                                network = `Ethereum Test Network`;
                                break;

                            case 4:
                                network = `Ethereum Test Network`;
                                break;

                            case 5:
                                network = `Ethereum Test Network`;
                                break;

                            case 10:
                                network = `Optimism Mainnet`;
                                break;

                            case 25:
                                network = `Cronos Mainnet`;
                                break;

                            case 56:
                                network = `Binance Smart Chain`;
                                break;

                            case 61:
                                network = `Ethereum Classic`;
                                break;

                            case 100:
                                network = `Gnosis Mainnet`;
                                break;

                            case 137:
                                network = `Polygon Mainnet`;
                                break;

                            case 250:
                                network = `Fantom Mainnet`;
                                break;

                            case 1284:
                                network = `Moonbeam Mainnet`;
                                break;

                            case 1284:
                                network = `Moonriver Mainnet`;
                                break;

                            case 4689:
                                network = `Iotex Mainnet`;
                                break;

                            case 43114:
                                network = `Avalanche C-Chain`;
                                break;

                            case 42161:
                                network = `Arbitrum Mainnet`;
                                break;

                            case 1666600000:
                                network = `Harmony Mainnet`;
                                break;

                            case 1666600001:
                                network = `Harmony Mainnet`;
                                break;

                            case 1666600002:
                                network = `Harmony Mainnet`;
                                break;

                            case 1666600003:
                                network = `Harmony Mainnet`;
                                break;

                            default:
                                network = undefined;
                                break;
                        }

                        msg = ( network !== undefined ) ? `Unsupported Network ${network}: Connect To Ethereum Mainnet` : `Unsupported Network: Connect To Ethereum Mainnet`;

                        this.setMessage( msg );
                        this.setMessageType( "warning" );
                }
            }

        private async connect(): Promise<void>
            {
                try {

                    const instance = await this.web3Modal.connect() as ExternalProvider;

                    this.provider = new ethers.providers.Web3Provider( instance );

                    const signer = this.provider.getSigner();

                    this.registerEvents();

                    await this.initWallet();

                } catch ( err ) {
                    this.setMessageType( "error" );
                    this.setMessage( err );
                }
            }

        private disconnect(): void
            {

                try {
                    this.web3Modal.clearCachedProvider();
                    this.resetState();
                } catch( err ) {
                    console.log( `Warning: ${err}` );
                }

            }

        private dismissMessageBox(): void
            {
                this.setState({
                    message: null
                })
            }

        private formatDisplayPrice(): string
            {
                return String( `${utils.formatEther(this.state.tokenPrice.mul(this.state.mintAmount))} ${this.state.networkConfig.symbol} ` );
            }

        private generateContractUrl(): string
            {
                return this.state.networkConfig.blockExplorer.generateContractUrl( CollectionConfig.contractAddress! );
            }

        private generateMarketplaceUrl(): string
            {
                return "https://opensea.io/collection/bagholderz-nft";
            }

        private generateTransactionUrl(transactionHash: string): string
            {
                return this.state.networkConfig.blockExplorer.generateTransactionUrl( transactionHash );
            }

        private async initWallet(): Promise<void>
            {
                const walletAccounts = await this.provider.listAccounts();

                this.setState( defaultState );

                if ( walletAccounts.length === 0 ) {
                    return;
                }

                const network = await this.provider.getNetwork();

                let networkConfig: NetworkConfigInterface;

                this.checkChainID( network.chainId );

                if( network.chainId === 1 ) {
                    networkConfig = CollectionConfig.mainnet;
                } else {
                    return;
                }

                this.setState({
                    userAddress: walletAccounts[0],
                    network,
                    networkConfig
                });

                try {
                    await this.lookupENS();
                } catch( err ) {
                    console.log( `Could Not Resolve ENS Domain Name` );
                }

                try{
                    await this.lookupUNS();
                } catch( err ) {
                    console.log( `Could Not Resolve Unstoppable Domains Domain Name` );
                }

                if ( await this.provider.getCode( CollectionConfig.contractAddress! ) === '0x' ) {
                    this.setMessage( "Could Not Find The Contract. Must Be Connected To The Ethereum Mainnet" );
                    this.setMessageType( "warning" );

                    return;
                }

                this.contract = new ethers.Contract(
                    CollectionConfig.contractAddress!,
                    ContractAbi,
                    this.provider.getSigner()
                ) as NFTContractType;

                this.refreshContractState();
            }

        private isContractReady(): boolean
            {
                return this.contract !== undefined;
            }

        private isSoldOut(): boolean
            {
                return this.state.maxSupply !== 0 && this.state.totalSupply >= this.state.maxSupply;
            }

        private isNotMainnet(): boolean
            {
                return this.state.network !== null && this.state.network.chainId !== CollectionConfig.mainnet.chainId;
            }

        private isWalletConnected(): boolean
            {
                return this.state.userAddress !== null;
            }

        private async lookupENS(): Promise<void>
            {
                if( this.state.userAddress !== null ) {
                    let ens = await this.provider.lookupAddress( String( this.state.userAddress ) );

                    if( ens !== null && ens !== undefined ) {
                        this.setState({
                            ens: ens
                        });
                    }
                }
            }

        private async lookupUNS(): Promise<void>
            {

                if( this.state.userAddress !== null ) {

                    const resolution = new Resolution();

                    let uns = await resolution.reverse( this.state.userAddress, { location: "UNSLayer2"} );

                    if( uns !== null && uns !== undefined ) {

                        this.setState({
                            uns: String( uns )
                        });

                    }
                }
            }

        private decrementMintAmount(): void
            {
                this.setState({
                    mintAmount: Math.max( 1, this.state.mintAmount - 1 ),
                }, () => {
                    this.updateDisplayPrice();
                });
            }

        private incrementMintAmount(): void
            {
                this.setState({
                    mintAmount: Math.min( this.state.maxMintAmountPerTx, this.state.mintAmount + 1 ),
                }, () => {
                    this.updateDisplayPrice();
                });
            }

        private async mint(): Promise<void>
            {
                if ( !this.state.isPaused ) {
                    await this.mintTokens( this.state.mintAmount );

                    return;
                }
                await this.whitelistMintTokens( this.state.mintAmount );
            }

        async mintTokens( amount: number ): Promise<void>
            {

                try {

                    this.setState({ loading: true });

                    const transaction = await this.contract.mint( amount, {value: this.state.tokenPrice.mul( amount )} );

                    toast.info(<>
                        Transaction Sent: Waiting For Confirmation<br/>
                        <a href={this.generateTransactionUrl(transaction.hash)} target="_blank" rel="noopener">View TX: {this.state.networkConfig.blockExplorer.name}</a>
                    </>);

                    const receipt = await transaction.wait();

                    toast.success(<>
                        Transaction Successful!<br />
                        <a href={this.generateTransactionUrl(receipt.transactionHash)} target="_blank" rel="noopener">View TX: {this.state.networkConfig.blockExplorer.name}</a>
                    </>);

                    this.refreshContractState();

                    this.setState({ loading: false });

                } catch ( err ) {
                    this.setMessage( err );
                    this.setMessageType( "error" );
                    this.setState({ loading: false });
                }
            }

        private async refreshContractState(): Promise<void>
            {
                this.setState({
                    maxSupply: ( await this.contract.maxSupply() ).toNumber(),
                    totalSupply: ( await this.contract.totalSupply() ).toNumber(),
                    maxMintAmountPerTx: ( await this.contract.maxMintAmountPerTx() ).toNumber(),
                    tokenPrice: await this.contract.cost(),
                    isPaused: await this.contract.paused(),
                    isWhitelistMintEnabled: await this.contract.whitelistMintEnabled(),
                    isUserInWhitelist: Whitelist.contains( this.state.userAddress ?? "" )
                });
            }

        private registerEvents(): void
            {

                // @ts-ignore
                this.provider.provider.on( "accountsChanged", () => {
                    this.resetState();
                    this.initWallet();
                });

                // @ts-ignore
                this.provider.provider.on( "chainChanged", () => {
                    window.location.reload();
                });

                // @ts-ignore
                this.provider.provider.on( "disconnect", () => {
                    this.disconnect();
                });

            }

        private resetState(): void
            {
                this.setState( defaultState );
            }

        private formatMessage( err: string|null = null ): string|null
            {

                let msg;

                if( err !== null && typeof err === "string" )
                    {

                        err = String( err ).toLowerCase();

                        if( err.includes( "insufficient" ) ) {

                            msg = `Insufficient ETH In Wallet To Mint`;

                        } else if( err.includes( "rejected" ) || err.includes( "user closed" ) ) {

                            msg = null;

                        } else {

                            msg = `Unknown Error`;

                        }
                    }

                return ( msg !== undefined ) ? msg : null;
            }

        private setMessage( error: any = null ): void
            {

                console.log( `Original Error Message:` );
                console.log( error );

                let msg;

                if ( typeof error === "string" ) {

                    msg = error;

                } else if ( typeof error === "object" ) {

                    if ( error?.error?.message !== undefined ) {

                        msg = error.error.message;

                    } else if ( error?.data?.message !== undefined ) {

                        msg = error.data.message;

                    } else if ( error?.message !== undefined ) {

                        msg = error.message;

                    } else if ( React.isValidElement( error ) ) {

                        return;
                    }

                } else {

                    msg = null;

                }

                msg = ( msg !== null && msg !== undefined ) ? this.formatMessage( msg ) : null;

                this.setState({
                    message: ( msg === null ) ? null : String( msg )
                });

                if( this.state.messageType === null ) {
                    this.setState({
                        messageType: "error"
                    });
                }
            }

        private setMessageType( type: string|null = null ): void
            {
                this.setState({
                    messageType: ( type === null ) ? null : String( type ).toLowerCase()
                });
            }

        private updateDisplayPrice(): void
            {
                this.setState({
                    displayPrice: this.formatDisplayPrice()
                }, () => {
                    this.forceUpdate();
                });
            }

        async whitelistMintTokens( amount: number ): Promise<void>
            {

                try {

                    this.setState({ loading: true });

                    const transaction = await this.contract.whitelistMint( amount, Whitelist.getProofForAddress( this.state.userAddress! ), {value: this.state.tokenPrice.mul( amount )} );

                    toast.info(<>
                        Transaction Sent: Waiting For Confirmation<br/>
                        <a href={this.generateTransactionUrl( transaction.hash )} target="_blank" rel="noopener">View TX: {this.state.networkConfig.blockExplorer.name}</a>
                    </>);

                    const receipt = await transaction.wait();

                    toast.success(<>
                        Transaction Successful!<br />
                        <a href={this.generateTransactionUrl( receipt.transactionHash )} target="_blank" rel="noopener">View TX: {this.state.networkConfig.blockExplorer.name}</a>
                    </>);

                    this.refreshContractState();

                    this.setState({ loading: false });

                } catch ( err ) {

                    this.setMessage( err );
                    this.setMessageType( "error" );
                    this.setState({ loading: false });

                }

            }

        render() {
            return (
                <>
                    <main>
                        <header>
                            <hgroup>
                                <h1>bagholderz</h1>
                                <h2>what shitcoin are you bagholding?</h2>
                                <h3>NFT Collection Reflecting On The Current Market Sentiment & The Crypto Community.</h3>
                                <h4>&copy; 2022 bagholderz</h4>
                            </hgroup>
                        </header>
                        {this.isNotMainnet()}
                        <section className={this.isWalletConnected() ? "connected" : ""}>
                        <MessageBox
                            message={this.state.message}
                            messageType={this.state.messageType}
                            dismissMessageBox={() => this.dismissMessageBox()}
                        />
                        <ConnectedWallet
                            userAddress={this.state.userAddress}
                        />
                        {this.isContractReady() ?
                            <>
                            {!this.isSoldOut() ?
                                <MintWidget
                                    isPaused={this.state.isPaused}
                                    loading={this.state.loading}
                                    mintAmount={this.state.mintAmount}
                                    decrementMintAmount={() => this.decrementMintAmount()}
                                    incrementMintAmount={() => this.incrementMintAmount()}
                                    mint={() => this.mint()}
                                />
                            :
                                <figure className="sold-out">
                                    <figcaption>Collection Minting Complete!<a href={this.generateMarketplaceUrl()} target="_blank" rel="noopener">Check Availability On OpenSea</a></figcaption>
                                </figure>
                            }
                            </>
                        :
                                <figure className="loading">
                                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="50" cy="50" r="45"/>
                                    </svg>
                                    <figcaption>Loading Collection</figcaption>
                                </figure>
                        }
                    </section>
                    <figure>
                        <CollectionStatus
                            displayPrice={this.state.displayPrice}
                            maxSupply={this.state.maxSupply}
                            totalSupply={this.state.totalSupply}
                        />
                        <Sample

                        />
                    </figure>
                    </main>
                    <Footer
                        ens={this.state.ens}
                        uns={this.state.uns}
                        userAddress={this.state.userAddress}
                        connect={() => this.connect()}
                        disconnect={() => this.disconnect()}
                        generateContractUrl={() => this.generateContractUrl()}
                        generateMarketplaceUrl={() => this.generateMarketplaceUrl()}
                        isWalletConnected={() => this.isWalletConnected()}
                    />
                <figure id="notifications"></figure>
                </>
            )
        }
    }
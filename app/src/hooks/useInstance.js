import { useEffect, useState,useMemo } from 'react';
import { useWeb3Context } from 'web3-react'
import SupplyChainContract from "../contracts/MainChain.json";

export default function() {

    const context = useWeb3Context();
    const [instance, setInstance] = useState(null);

    useEffect(() => {
		if (context.connectorName === undefined) {
			if (window.web3 === undefined) {
				context.setConnector("Infura");
			} else {
				context.setConnector("MetaMask");
			}
		} else {
			if (context != null) {
			const deployedNetwork = SupplyChainContract.networks[context.networkId];
				const supplychainInstance = new context.library.eth.Contract(
					SupplyChainContract.abi,
					deployedNetwork && deployedNetwork.address,
				)
				setInstance(supplychainInstance);
			}
		}
    }, [context]);

    return useMemo(() => instance);
}
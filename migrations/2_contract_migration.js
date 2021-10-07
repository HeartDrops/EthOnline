const ACHouseParent = artifacts.require("ACHouse");
const ACHouseToken1155 = artifacts.require("ACHouseToken1155");
const ACHouseToken721 = artifacts.require("ACHouseToken721");

module.exports = async function (deployer) {
	let mToken, nToken;

	await deployer.deploy(ACHouseToken1155).then(function (minstance) {
		mToken = minstance;
	});

	await deployer.deploy(ACHouseToken721).then(function (ninstance) {
		ntoken = ninstance;
	});

	const ACHParent = await deployer.deploy(
		ACHouseParent,
		mToken.address,
		ntoken.address
	);
};

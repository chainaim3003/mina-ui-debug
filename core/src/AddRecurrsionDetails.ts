import { Field, SelfProof, ZkProgram, verify } from 'o1js';

const Add = ZkProgram({
  name: 'add-example',
  publicInput: Field,

  //let recursionCounter = 0;

  methods: {
    init: {
      privateInputs: [],

      async method(state: Field) {
        //console.log(' in recurrsion  Add  Details :  init',Date.now());
        //state.assertEquals(Field(0));
        state.assertEquals(Field(2));
      },
    },

    addNumber: {
      privateInputs: [SelfProof, Field],

      async method(
        newState: Field,
        earlierProof: SelfProof<Field, void>,
        numberToAdd: Field
      ) {

        //console.log(' in recurrsion Add : addNumber  newState', newState , ' ..earlierProof ..',earlierProof.publicInput.value[0] ,'  numberToAdd  '  , numberToAdd ,      Date.now());
        earlierProof.verify(); 

        //await verify(proof0.toJSON(), verificationKey);
        //let epRes = await verify(earlierProof, verificationKey);
        //console.log (" ep res ", epRes);

        newState.assertEquals(earlierProof.publicInput.add(numberToAdd));
      },
    },

    add: {
      privateInputs: [SelfProof, SelfProof],

      async method(
        newState: Field,
        earlierProof1: SelfProof<Field, void>,
        earlierProof2: SelfProof<Field, void>
      ) {
        //console.log(' rec counter ', recursionCounter);
        //console.log(' in recurrsion Add : addNumber  newState  ', newState , ' earlierProof1  ' , earlierProof1, ' earlierProof2  ' , earlierProof2 ,    Date.now());

        earlierProof1.verify();
        earlierProof2.verify();

        newState.assertEquals(
          earlierProof1.publicInput.add(earlierProof2.publicInput)
        );

      },
    },
  },
});

async function main() {
  console.log('compiling...', Date.now());

  const { verificationKey } = await Add.compile();

  console.log( ' compiled .. verificationkey', verificationKey )

  console.log( ' compiled ..  VK    val 0  '  ,  verificationKey.hash.value[0], ' val 1 ' ,  verificationKey.hash.value[1].valueOf()  ,  ' val 2 ' ,  verificationKey.hash.value[2]  ,'making proof 0', Date.now());

  //const proof0 = await Add.init(Field(0)); // IMP NOTE : If i change this to any other number from 0 -- the  Add Init fails... unless init assert is in sync.. 
  const proof0 = await Add.init(Field(2)); 

  //console.log( ' after proof0 init.. ..', verificationKey , '  val 0  '  ,  verificationKey.hash.value[0], ' val 1 ' ,  verificationKey.hash.value[1]  ,  ' val 2 ' ,  verificationKey.hash.value[2]  ,'making proof 0', Date.now());

  console.log('after proof 0  public input ', proof0.publicInput.toJSON(), '  .. proof0 should verify val[0] ', proof0.shouldVerify.value[0], Date.now());

  console.log('after proof 0  proof  ', proof0.proof );

//let res0 = proof0.verify();

const proof0Res = await verify(proof0.toJSON(), verificationKey);

//console.log( ' after proof0 verify.. ', '  ... res0 ..'  , res0 , verificationKey , '  val 0  '  ,  verificationKey.hash.value[0], ' val 1 ' ,  verificationKey.hash.value[1]  ,  ' val 2 ' ,  verificationKey.hash.value[2]  ,' after verifying proof 0', Date.now());

console.log('after proof 0  res ', proof0Res   ,' public input ', proof0.publicInput.toString(), '  .. proof0 should verify  val[1] ', proof0.shouldVerify.value[1], ' public output .. ' , proof0.publicOutput, ' proof0Res '  , proof0Res  , Date.now());

  console.log('making proof 1 ',Date.now());

  //const proof1 = await Add.addNumber(Field(4), proof0, Field(4));

  const proof1 = await Add.addNumber(Field(6), proof0, Field(4));
  
 //console.log( ' after proof1 addNumber.. ..', verificationKey , '  val 0  '  ,  verificationKey.hash.value[0], ' val 1 ' ,  verificationKey.hash.value[1]  ,  ' val 2 ' ,  verificationKey.hash.value[2]  ,'making proof 0', Date.now());

  const proof1Res = proof1.verify();

  console.log('after proof 1  res ', proof1Res   ,' public input ', proof0.publicInput.toString(), '  .. proof1 should verify  val[1] ', proof1.shouldVerify.value[1], ' public output .. ' , proof1.publicOutput, ' proof1Res 0 '  , proof1Res  , Date.now());

  console.log('after proof 1  public input ', proof1.publicInput.toString(), '  .. proof1 ', proof1, Date.now());


  console.log('making proof 2',Date.now());

    console.log('making proof 2  ... proof0Res ', proof0Res  ,' proof 0 should verify  val[1] ', proof0.shouldVerify.toField().toJSON(), ' ..  ' , proof0.shouldVerify.value  ,   ' proof0 public Input ',proof0.publicInput.toJSON());
    console.log('making proof 2  ... proof1Res ', proof1Res  ,' proof 1 should verify  val[1] ', proof1.shouldVerify.toField().toJSON(), ' ..  ' , proof1.shouldVerify.value  ,   ' proof1 public Input ',proof1.publicInput.toJSON());


  //const proof2 = await Add.add(Field(4), proof1, proof0);

 const proof2 = await Add.add(Field(8), proof1, proof0);
  
//console.log( ' after proof2 add.. ..', verificationKey , '  val 0  '  ,  verificationKey.hash.value[0], ' val 1 ' ,  verificationKey.hash.value[1]  ,  ' val 2 ' ,  verificationKey.hash.value[2]  ,'making proof 0', Date.now());

  console.log('after proof 2  public input ', proof2.publicInput.toString(), '  .. proof2 ', proof2,Date.now()); 

  console.log('verifying proof 2',Date.now());
  console.log('proof 2 data', proof2.publicInput.toString(),Date.now()  );

  const ok = await verify(proof2.toJSON(), verificationKey);
  
//console.log( ' after proof2 verify.. ..', verificationKey , '  val 0  '  ,  verificationKey.hash.value[0], ' val 1 ' ,  verificationKey.hash.value[1]  ,  ' val 2 ' ,  verificationKey.hash.value[2]  ,'making proof 0', Date.now());

  console.log('ok', ok,Date.now());
}

main();
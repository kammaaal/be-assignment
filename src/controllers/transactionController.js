const processTransaction = (transaction) => {
    return new Promise((resolve, reject) => {
      console.log('Transaction processing started for:', transaction);
  
      setTimeout(() => {
        console.log('transaction processed for:', transaction);
        resolve(transaction);
      }, 30000); // 30 seconds
    });
  };
  
  const send = async (request, reply, prismaClient) => {
    const { amount, toAddress, accountId } = request.body;
    const transaction = { amount, toAddress, status: 'pending' };
  
    try {
      const processedTransaction = await processTransaction(transaction);
      await prismaClient.paymentHistory.create({
        data: {
          accountId,
          amount: processedTransaction.amount,
          transactionType: 'send',
          timestamp: new Date(),
        }
      });
      reply.send({ message: 'Transaction successful' });
    } catch (error) {
      reply.code(500).send({ message: 'Transaction failed' });
    }
  };
  
  const withdraw = async (request, reply, prismaClient) => {
    const { amount, accountId } = request.body;
    const transaction = { amount, toAddress: 'withdrawal', status: 'pending' };
  
    try {
      const processedTransaction = await processTransaction(transaction);
      await prismaClient.paymentHistory.create({
        data: {
          accountId,
          amount: processedTransaction.amount,
          transactionType: 'withdraw',
          timestamp: new Date(),
        }
      });
      reply.send({ message: 'Transaction successful' });
    } catch (error) {
      reply.code(500).send({ message: 'Transaction failed' });
    }
  };
  
  module.exports = { send, withdraw };  
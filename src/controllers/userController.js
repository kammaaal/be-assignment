const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async (request, reply, prismaClient) => {
  const { email, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prismaClient.user.create({
    data: { email, password: hashedPassword }
  });
  reply.send(user);
};

const login = async (request, reply, prismaClient) => {
  const { email, password } = request.body;
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    reply.code(401).send({ message: 'Invalid email or password' });
    return;
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    reply.code(401).send({ message: 'Invalid email or password' });
    return;
  }
  const token = jwt.sign({ userId: user.id }, 'supersecret');
  reply.send({ token });
};

const getAccounts = async (request, reply, prismaClient) => {
  const { userId } = request.user;
  const accounts = await prismaClient.paymentAccount.findMany({ where: { userId } });
  reply.send(accounts);
};

const getTransactions = async (request, reply, prismaClient) => {
  const { accountId } = request.params;
  const transactions = await prismaClient.paymentHistory.findMany({ where: { accountId } });
  reply.send(transactions);
};

module.exports = { register, login, getAccounts, getTransactions };

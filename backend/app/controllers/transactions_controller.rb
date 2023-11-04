class TransactionsController < ApplicationController
  def index
    transactions = Transaction.where(owner: user!)

    render json: {transactions: TransactionBlueprint.render_as_json(transactions, view: :normal) }, status: :ok
  end

  def create
    transaction = CreateTransaction.new(transaction_params).call

    render json: {transaction: TransactionBlueprint.render_as_json(transaction, view: :normal) }, status: :ok
  end

  private

  def transaction_params
    params.require(:transaction)
      .permit(
        :tx_hash,
        :chain_id
      )
  end
end

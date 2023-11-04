class TransactionsController < ApplicationController
  def index
    transactions = Transaction.where(user: user!)

    render json: {transactions: TransactionBlueprint.render_as_json(transactions, view: :normal) }, status: :ok
  end

  def create
    transactions = CreateTransaction.new(transaction_params).call

    render json: {transactions: TransactionBlueprint.render_as_json(transactions, view: :normal) }, status: :ok
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

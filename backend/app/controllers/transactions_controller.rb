class TransactionsController < ApplicationController
  def index
    transactions = Transaction.where(user: user!)

    render json: {transactions: TransactionBlueprint.render_as_json(transactions, view: :normal) }, status: :ok
  end

  def create
    CreateTransaction.new(
      tx_hash: transaction_params["tx_hash"],
      chain_id: transaction_params["chain_id"]
    ).call

    transactions = Transactionwere(tx_hash: transaction_params["tx_hash"])
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

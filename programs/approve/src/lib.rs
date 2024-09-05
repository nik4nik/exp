use anchor_lang::prelude::*;

#[constant]
pub const SEED: &str = "anchor";
pub const ANCHOR_DISCRIMINATOR: usize = 8;

#[account]
#[derive(InitSpace)]
pub struct EscrowAccount {}

use anchor_spl::{
    associated_token::AssociatedToken,
    token_2022::{approve, Approve},
    token_interface::{
        Mint,
        TokenAccount,
        TokenInterface,
    }
};

#[derive(Accounts)]
#[instruction(id: u64)]
pub struct MakeOffer<'info> {
    #[account(mut)]
    pub maker: Signer<'info>,

    #[account(mint::token_program = token_program)]
    pub atk_mint: InterfaceAccount<'info, Mint>,
    #[account(mint::token_program = token_program)]
    pub btk_mint: InterfaceAccount<'info, Mint>,

    #[account(
        mut,
        associated_token::mint = atk_mint,
        associated_token::authority = maker,
        associated_token::token_program = token_program
    )]
    pub maker_atk_account: InterfaceAccount<'info, TokenAccount>,

    #[account(
        init,
        payer = maker,
        space = ANCHOR_DISCRIMINATOR + EscrowAccount::INIT_SPACE,
        seeds = [b"escrow", maker.key().as_ref(), id.to_le_bytes().as_ref()],
        //seeds = [b"escrow", maker.key().as_ref()],
        bump
    )]
    pub escrow_account: Account<'info, EscrowAccount>,

    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Interface<'info, TokenInterface>,
    pub system_program: Program<'info, System>,
}

declare_id!("HuiPALciELxD8oULPqk77NnDKaJihZsnmVdPxA6La9me");

#[program]
pub mod approve {
    use super::*;
    pub fn make_offer(
        context: Context<MakeOffer>,
        id: u64,
        maker_atk_amount: u64,
    ) -> Result<()> {
        Ok(())
    }
}
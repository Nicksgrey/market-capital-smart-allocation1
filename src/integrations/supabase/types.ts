export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      agendamentos: {
        Row: {
          created_at: string
          data_agendamento: string
          email: string
          id: string
          mensagem: string | null
          nome: string
          perfil_investidor: string | null
          status: string
          telefone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_agendamento: string
          email: string
          id?: string
          mensagem?: string | null
          nome: string
          perfil_investidor?: string | null
          status?: string
          telefone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_agendamento?: string
          email?: string
          id?: string
          mensagem?: string | null
          nome?: string
          perfil_investidor?: string | null
          status?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      bank_accounts: {
        Row: {
          account_number: string | null
          bank_name: string | null
          created_at: string | null
          current_balance: number | null
          id: string
          initial_balance: number | null
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          account_number?: string | null
          bank_name?: string | null
          created_at?: string | null
          current_balance?: number | null
          id?: string
          initial_balance?: number | null
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      business_expenses: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          end_date: string | null
          frequency: string
          id: string
          name: string
          start_date: string
          status: string
          updated_at: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          name: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string | null
          frequency?: string
          id?: string
          name?: string
          start_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      clientes_antigos: {
        Row: {
          created_at: string
          id: string
          nascimento: string | null
          nome: string
          patrimonio: number
          status_evolucao: string
          telefone: string | null
          transferido: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          nascimento?: string | null
          nome: string
          patrimonio?: number
          status_evolucao?: string
          telefone?: string | null
          transferido?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          nascimento?: string | null
          nome?: string
          patrimonio?: number
          status_evolucao?: string
          telefone?: string | null
          transferido?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          aua: number
          benchmark_rate: number
          created_at: string
          entry_date: string
          fixed_revenue: number
          id: string
          institutions: Json | null
          name: string
          performance_fee_rate: number
          scheduled_deposit_amount: number | null
          scheduled_deposit_day: number | null
          services: string[] | null
          status: string
          updated_at: string
          variable_revenue: number
        }
        Insert: {
          aua?: number
          benchmark_rate?: number
          created_at?: string
          entry_date: string
          fixed_revenue?: number
          id?: string
          institutions?: Json | null
          name: string
          performance_fee_rate?: number
          scheduled_deposit_amount?: number | null
          scheduled_deposit_day?: number | null
          services?: string[] | null
          status?: string
          updated_at?: string
          variable_revenue?: number
        }
        Update: {
          aua?: number
          benchmark_rate?: number
          created_at?: string
          entry_date?: string
          fixed_revenue?: number
          id?: string
          institutions?: Json | null
          name?: string
          performance_fee_rate?: number
          scheduled_deposit_amount?: number | null
          scheduled_deposit_day?: number | null
          services?: string[] | null
          status?: string
          updated_at?: string
          variable_revenue?: number
        }
        Relationships: []
      }
      company_financials: {
        Row: {
          ano: number
          cagr_lucro_5y: number | null
          capital_investido: number | null
          company_name: string | null
          created_at: string | null
          divida_liquida: number | null
          divida_total: number | null
          fluxo_caixa_livre: number | null
          id: string
          lpa: number | null
          lucro_bruto: number | null
          lucro_liquido: number | null
          lucro_operacional: number | null
          nopat: number | null
          num_acoes: number | null
          patrimonio_liquido: number | null
          pl: number | null
          preco_acao: number | null
          receita_liquida: number | null
          roic: number | null
          sector: string | null
          ticker: string
          updated_at: string | null
        }
        Insert: {
          ano: number
          cagr_lucro_5y?: number | null
          capital_investido?: number | null
          company_name?: string | null
          created_at?: string | null
          divida_liquida?: number | null
          divida_total?: number | null
          fluxo_caixa_livre?: number | null
          id?: string
          lpa?: number | null
          lucro_bruto?: number | null
          lucro_liquido?: number | null
          lucro_operacional?: number | null
          nopat?: number | null
          num_acoes?: number | null
          patrimonio_liquido?: number | null
          pl?: number | null
          preco_acao?: number | null
          receita_liquida?: number | null
          roic?: number | null
          sector?: string | null
          ticker: string
          updated_at?: string | null
        }
        Update: {
          ano?: number
          cagr_lucro_5y?: number | null
          capital_investido?: number | null
          company_name?: string | null
          created_at?: string | null
          divida_liquida?: number | null
          divida_total?: number | null
          fluxo_caixa_livre?: number | null
          id?: string
          lpa?: number | null
          lucro_bruto?: number | null
          lucro_liquido?: number | null
          lucro_operacional?: number | null
          nopat?: number | null
          num_acoes?: number | null
          patrimonio_liquido?: number | null
          pl?: number | null
          preco_acao?: number | null
          receita_liquida?: number | null
          roic?: number | null
          sector?: string | null
          ticker?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversion_events: {
        Row: {
          created_at: string
          event_data: Json | null
          event_type: string
          id: string
          session_id: string
          time_to_event_seconds: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_data?: Json | null
          event_type: string
          id?: string
          session_id: string
          time_to_event_seconds?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_data?: Json | null
          event_type?: string
          id?: string
          session_id?: string
          time_to_event_seconds?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      cost_centers: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      credit_card_invoices: {
        Row: {
          amount: number
          created_at: string | null
          credit_card_id: string
          due_date: string
          id: string
          is_paid: boolean | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          credit_card_id: string
          due_date: string
          id?: string
          is_paid?: boolean | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          credit_card_id?: string
          due_date?: string
          id?: string
          is_paid?: boolean | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "credit_card_invoices_credit_card_id_fkey"
            columns: ["credit_card_id"]
            isOneToOne: false
            referencedRelation: "credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      credit_cards: {
        Row: {
          category: string
          created_at: string | null
          current_balance: number
          id: string
          institution: string
          is_active: boolean | null
          updated_at: string | null
        }
        Insert: {
          category?: string
          created_at?: string | null
          current_balance?: number
          id?: string
          institution: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          current_balance?: number
          id?: string
          institution?: string
          is_active?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          created_at: string | null
          document: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      fiis: {
        Row: {
          created_at: string
          id: string
          liquidez_diaria: number | null
          ltv: number | null
          nome: string
          p_vp: number | null
          preco_atual: number | null
          preco_atual_updated_at: string | null
          razao_social: string | null
          setor: string | null
          ticker: string
          tipo: string | null
          updated_at: string
          vacancia: number | null
          valor_patrimonial: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          liquidez_diaria?: number | null
          ltv?: number | null
          nome: string
          p_vp?: number | null
          preco_atual?: number | null
          preco_atual_updated_at?: string | null
          razao_social?: string | null
          setor?: string | null
          ticker: string
          tipo?: string | null
          updated_at?: string
          vacancia?: number | null
          valor_patrimonial?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          liquidez_diaria?: number | null
          ltv?: number | null
          nome?: string
          p_vp?: number | null
          preco_atual?: number | null
          preco_atual_updated_at?: string | null
          razao_social?: string | null
          setor?: string | null
          ticker?: string
          tipo?: string | null
          updated_at?: string
          vacancia?: number | null
          valor_patrimonial?: number | null
        }
        Relationships: []
      }
      financial_movements: {
        Row: {
          amount: number
          client_id: string
          created_at: string
          id: string
          institution: string
          movement_date: string
          movement_type: string
          reason: string
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          created_at?: string
          id?: string
          institution: string
          movement_date: string
          movement_type: string
          reason: string
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          created_at?: string
          id?: string
          institution?: string
          movement_date?: string
          movement_type?: string
          reason?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_movements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_projections: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          id: string
          name: string
          notes: string | null
          projection_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          notes?: string | null
          projection_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          notes?: string | null
          projection_date?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_projections_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      financial_transactions: {
        Row: {
          amount: number
          bank_account_id: string | null
          bank_name: string | null
          category_id: string | null
          cost_center_id: string | null
          created_at: string | null
          customer_id: string | null
          description: string
          due_date: string | null
          id: string
          installment_number: number | null
          is_installment: boolean | null
          notes: string | null
          parent_transaction_id: string | null
          payment_date: string | null
          payment_method_id: string | null
          status: Database["public"]["Enums"]["payment_status"] | null
          supplier_id: string | null
          total_installments: number | null
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          amount: number
          bank_account_id?: string | null
          bank_name?: string | null
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description: string
          due_date?: string | null
          id?: string
          installment_number?: number | null
          is_installment?: boolean | null
          notes?: string | null
          parent_transaction_id?: string | null
          payment_date?: string | null
          payment_method_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          supplier_id?: string | null
          total_installments?: number | null
          transaction_date: string
          transaction_type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          amount?: number
          bank_account_id?: string | null
          bank_name?: string | null
          category_id?: string | null
          cost_center_id?: string | null
          created_at?: string | null
          customer_id?: string | null
          description?: string
          due_date?: string | null
          id?: string
          installment_number?: number | null
          is_installment?: boolean | null
          notes?: string | null
          parent_transaction_id?: string | null
          payment_date?: string | null
          payment_method_id?: string | null
          status?: Database["public"]["Enums"]["payment_status"] | null
          supplier_id?: string | null
          total_installments?: number | null
          transaction_date?: string
          transaction_type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "financial_transactions_bank_account_id_fkey"
            columns: ["bank_account_id"]
            isOneToOne: false
            referencedRelation: "bank_accounts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_cost_center_id_fkey"
            columns: ["cost_center_id"]
            isOneToOne: false
            referencedRelation: "cost_centers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_parent_transaction_id_fkey"
            columns: ["parent_transaction_id"]
            isOneToOne: false
            referencedRelation: "financial_transactions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "financial_transactions_supplier_id_fkey"
            columns: ["supplier_id"]
            isOneToOne: false
            referencedRelation: "suppliers"
            referencedColumns: ["id"]
          },
        ]
      }
      fundamental_analysis: {
        Row: {
          created_at: string
          debt_to_fcf: number | null
          eps_cagr_10y: number | null
          eps_cagr_3y: number | null
          eps_cagr_5y: number | null
          equity_cagr_10y: number | null
          equity_cagr_3y: number | null
          equity_cagr_5y: number | null
          fcf_cagr_10y: number | null
          fcf_cagr_3y: number | null
          fcf_cagr_5y: number | null
          id: string
          revenue_cagr_10y: number | null
          revenue_cagr_3y: number | null
          revenue_cagr_5y: number | null
          roic_10y: number | null
          roic_3y: number | null
          roic_5y: number | null
          sector: string | null
          ticker: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          debt_to_fcf?: number | null
          eps_cagr_10y?: number | null
          eps_cagr_3y?: number | null
          eps_cagr_5y?: number | null
          equity_cagr_10y?: number | null
          equity_cagr_3y?: number | null
          equity_cagr_5y?: number | null
          fcf_cagr_10y?: number | null
          fcf_cagr_3y?: number | null
          fcf_cagr_5y?: number | null
          id?: string
          revenue_cagr_10y?: number | null
          revenue_cagr_3y?: number | null
          revenue_cagr_5y?: number | null
          roic_10y?: number | null
          roic_3y?: number | null
          roic_5y?: number | null
          sector?: string | null
          ticker: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          debt_to_fcf?: number | null
          eps_cagr_10y?: number | null
          eps_cagr_3y?: number | null
          eps_cagr_5y?: number | null
          equity_cagr_10y?: number | null
          equity_cagr_3y?: number | null
          equity_cagr_5y?: number | null
          fcf_cagr_10y?: number | null
          fcf_cagr_3y?: number | null
          fcf_cagr_5y?: number | null
          id?: string
          revenue_cagr_10y?: number | null
          revenue_cagr_3y?: number | null
          revenue_cagr_5y?: number | null
          roic_10y?: number | null
          roic_3y?: number | null
          roic_5y?: number | null
          sector?: string | null
          ticker?: string
          updated_at?: string
        }
        Relationships: []
      }
      historico_performance: {
        Row: {
          alfa: number | null
          client_id: string
          created_at: string
          id: string
          periodo: string
          retorno_benchmark: number
          retorno_portfolio: number
          updated_at: string
        }
        Insert: {
          alfa?: number | null
          client_id: string
          created_at?: string
          id?: string
          periodo: string
          retorno_benchmark: number
          retorno_portfolio: number
          updated_at?: string
        }
        Update: {
          alfa?: number | null
          client_id?: string
          created_at?: string
          id?: string
          periodo?: string
          retorno_benchmark?: number
          retorno_portfolio?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "historico_performance_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          lead_id: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          lead_id: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          lead_id?: string
          user_id?: string
        }
        Relationships: []
      }
      lead_painel_projecao_financeira: {
        Row: {
          custo_vida_atual: number | null
          data_criacao: string | null
          email: string
          id: string
          meta_valor: number | null
          nome: string
          objetivo_financeiro: string | null
          periodo_meses: number | null
          renda_passiva_pretendida: number | null
          rendimento_anual: number | null
          telefone: string
          valor_inicial: number | null
          valor_mensal: number | null
        }
        Insert: {
          custo_vida_atual?: number | null
          data_criacao?: string | null
          email: string
          id?: string
          meta_valor?: number | null
          nome: string
          objetivo_financeiro?: string | null
          periodo_meses?: number | null
          renda_passiva_pretendida?: number | null
          rendimento_anual?: number | null
          telefone: string
          valor_inicial?: number | null
          valor_mensal?: number | null
        }
        Update: {
          custo_vida_atual?: number | null
          data_criacao?: string | null
          email?: string
          id?: string
          meta_valor?: number | null
          nome?: string
          objetivo_financeiro?: string | null
          periodo_meses?: number | null
          renda_passiva_pretendida?: number | null
          rendimento_anual?: number | null
          telefone?: string
          valor_inicial?: number | null
          valor_mensal?: number | null
        }
        Relationships: []
      }
      lead_site_contato: {
        Row: {
          created_at: string
          data_criacao: string
          email: string
          id: string
          mensagem: string
          nome: string
          origem: string[] | null
          patrimonio: string
          renda_mensal: string
          telefone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          data_criacao?: string
          email: string
          id?: string
          mensagem: string
          nome: string
          origem?: string[] | null
          patrimonio: string
          renda_mensal: string
          telefone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          data_criacao?: string
          email?: string
          id?: string
          mensagem?: string
          nome?: string
          origem?: string[] | null
          patrimonio?: string
          renda_mensal?: string
          telefone?: string
          updated_at?: string
        }
        Relationships: []
      }
      leads_medexpert_academy: {
        Row: {
          created_at: string
          email: string | null
          id: string
          nome: string
          status_evolucao: string
          telefone: string | null
          transferido: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          nome: string
          status_evolucao?: string
          telefone?: string | null
          transferido?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          nome?: string
          status_evolucao?: string
          telefone?: string | null
          transferido?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      leads_quiz_financeiro: {
        Row: {
          agendamento_confirmado: boolean | null
          agendamento_data: string | null
          base_carteira: string | null
          calendly_event_uri: string | null
          compromisso: string | null
          controle_financas: string | null
          created_at: string
          crescimento_patrimonio: string | null
          email: string | null
          escolha_investimentos: string | null
          estado_civil: string | null
          experiencia_assessor: string | null
          id: string
          idade: string | null
          investimento_mensal: string | null
          motivo_sessao: string | null
          nome: string
          objetivo: string | null
          page_views: number | null
          patrimonio_atual: string | null
          plano_aposentadoria: string | null
          prazo_melhorias: string | null
          problema_resolver: string | null
          proposta_consultoria: string | null
          quiz_completed_at: string | null
          quiz_started_at: string | null
          reentradas: number
          respostas_quiz: Json | null
          situacao_atual: string | null
          status: string
          status_anterior: string | null
          telefone: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          valor_investido: string | null
          video_percentual: number | null
        }
        Insert: {
          agendamento_confirmado?: boolean | null
          agendamento_data?: string | null
          base_carteira?: string | null
          calendly_event_uri?: string | null
          compromisso?: string | null
          controle_financas?: string | null
          created_at?: string
          crescimento_patrimonio?: string | null
          email?: string | null
          escolha_investimentos?: string | null
          estado_civil?: string | null
          experiencia_assessor?: string | null
          id?: string
          idade?: string | null
          investimento_mensal?: string | null
          motivo_sessao?: string | null
          nome: string
          objetivo?: string | null
          page_views?: number | null
          patrimonio_atual?: string | null
          plano_aposentadoria?: string | null
          prazo_melhorias?: string | null
          problema_resolver?: string | null
          proposta_consultoria?: string | null
          quiz_completed_at?: string | null
          quiz_started_at?: string | null
          reentradas?: number
          respostas_quiz?: Json | null
          situacao_atual?: string | null
          status?: string
          status_anterior?: string | null
          telefone: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor_investido?: string | null
          video_percentual?: number | null
        }
        Update: {
          agendamento_confirmado?: boolean | null
          agendamento_data?: string | null
          base_carteira?: string | null
          calendly_event_uri?: string | null
          compromisso?: string | null
          controle_financas?: string | null
          created_at?: string
          crescimento_patrimonio?: string | null
          email?: string | null
          escolha_investimentos?: string | null
          estado_civil?: string | null
          experiencia_assessor?: string | null
          id?: string
          idade?: string | null
          investimento_mensal?: string | null
          motivo_sessao?: string | null
          nome?: string
          objetivo?: string | null
          page_views?: number | null
          patrimonio_atual?: string | null
          plano_aposentadoria?: string | null
          prazo_melhorias?: string | null
          problema_resolver?: string | null
          proposta_consultoria?: string | null
          quiz_completed_at?: string | null
          quiz_started_at?: string | null
          reentradas?: number
          respostas_quiz?: Json | null
          situacao_atual?: string | null
          status?: string
          status_anterior?: string | null
          telefone?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor_investido?: string | null
          video_percentual?: number | null
        }
        Relationships: []
      }
      map_investor_profiles: {
        Row: {
          age: number | null
          behavioral_profile: string | null
          behavioral_score: number | null
          completed_at: string | null
          created_at: string
          current_step: string
          dependents: number
          diagnosis: string | null
          emergency_reserve_months: string | null
          final_profile: string | null
          financial_capacity_label: string | null
          financial_capacity_score: number | null
          horizon_years: number | null
          id: string
          is_retired: boolean
          liquidity_need: string | null
          main_goal: string | null
          monthly_expenses: number | null
          monthly_income: number | null
          net_worth: number | null
          recommended_volatility: number | null
          risk_budget_score: number | null
          selected_volatility: number | null
          status: string
          updated_at: string
          user_id: string
          volatility_range_max: number | null
          volatility_range_min: number | null
          volatility_status: string | null
        }
        Insert: {
          age?: number | null
          behavioral_profile?: string | null
          behavioral_score?: number | null
          completed_at?: string | null
          created_at?: string
          current_step?: string
          dependents?: number
          diagnosis?: string | null
          emergency_reserve_months?: string | null
          final_profile?: string | null
          financial_capacity_label?: string | null
          financial_capacity_score?: number | null
          horizon_years?: number | null
          id?: string
          is_retired?: boolean
          liquidity_need?: string | null
          main_goal?: string | null
          monthly_expenses?: number | null
          monthly_income?: number | null
          net_worth?: number | null
          recommended_volatility?: number | null
          risk_budget_score?: number | null
          selected_volatility?: number | null
          status?: string
          updated_at?: string
          user_id: string
          volatility_range_max?: number | null
          volatility_range_min?: number | null
          volatility_status?: string | null
        }
        Update: {
          age?: number | null
          behavioral_profile?: string | null
          behavioral_score?: number | null
          completed_at?: string | null
          created_at?: string
          current_step?: string
          dependents?: number
          diagnosis?: string | null
          emergency_reserve_months?: string | null
          final_profile?: string | null
          financial_capacity_label?: string | null
          financial_capacity_score?: number | null
          horizon_years?: number | null
          id?: string
          is_retired?: boolean
          liquidity_need?: string | null
          main_goal?: string | null
          monthly_expenses?: number | null
          monthly_income?: number | null
          net_worth?: number | null
          recommended_volatility?: number | null
          risk_budget_score?: number | null
          selected_volatility?: number | null
          status?: string
          updated_at?: string
          user_id?: string
          volatility_range_max?: number | null
          volatility_range_min?: number | null
          volatility_status?: string | null
        }
        Relationships: []
      }
      map_profile_snapshots: {
        Row: {
          behavioral_profile: string | null
          behavioral_score: number | null
          created_at: string
          final_profile: string | null
          financial_capacity_label: string | null
          financial_capacity_score: number | null
          id: string
          payload: Json
          profile_id: string
          recommended_volatility: number | null
          risk_budget_score: number | null
          selected_volatility: number | null
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          behavioral_profile?: string | null
          behavioral_score?: number | null
          created_at?: string
          final_profile?: string | null
          financial_capacity_label?: string | null
          financial_capacity_score?: number | null
          id?: string
          payload?: Json
          profile_id: string
          recommended_volatility?: number | null
          risk_budget_score?: number | null
          selected_volatility?: number | null
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          behavioral_profile?: string | null
          behavioral_score?: number | null
          created_at?: string
          final_profile?: string | null
          financial_capacity_label?: string | null
          financial_capacity_score?: number | null
          id?: string
          payload?: Json
          profile_id?: string
          recommended_volatility?: number | null
          risk_budget_score?: number | null
          selected_volatility?: number | null
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "map_profile_snapshots_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "map_investor_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      personal_alerts: {
        Row: {
          alert_type: string
          category_type: string
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          alert_type: string
          category_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          alert_type?: string
          category_type?: string
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      personal_auto_rules: {
        Row: {
          amount: number
          category_id: string | null
          category_type: string
          created_at: string | null
          day_of_month: number
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          category_id?: string | null
          category_type?: string
          created_at?: string | null
          day_of_month: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          category_type?: string
          created_at?: string | null
          day_of_month?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_auto_rules_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "personal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_card_installments: {
        Row: {
          card_id: string
          category_type: string
          created_at: string | null
          description: string
          due_date: string
          id: string
          installment_amount: number
          installment_number: number
          is_paid: boolean | null
          total_amount: number
          total_installments: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          card_id: string
          category_type?: string
          created_at?: string | null
          description: string
          due_date: string
          id?: string
          installment_amount?: number
          installment_number: number
          is_paid?: boolean | null
          total_amount?: number
          total_installments: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          card_id?: string
          category_type?: string
          created_at?: string | null
          description?: string
          due_date?: string
          id?: string
          installment_amount?: number
          installment_number?: number
          is_paid?: boolean | null
          total_amount?: number
          total_installments?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_card_installments_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "personal_credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_card_invoices: {
        Row: {
          amount: number
          card_id: string
          created_at: string | null
          due_date: string
          id: string
          is_paid: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          card_id: string
          created_at?: string | null
          due_date: string
          id?: string
          is_paid?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          card_id?: string
          created_at?: string | null
          due_date?: string
          id?: string
          is_paid?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_card_invoices_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "personal_credit_cards"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_categories: {
        Row: {
          category_type: string
          color: string | null
          created_at: string | null
          family_id: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category_type?: string
          color?: string | null
          created_at?: string | null
          family_id?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category_type?: string
          color?: string | null
          created_at?: string | null
          family_id?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_family"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "personal_families"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "personal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_costs: {
        Row: {
          amount: number
          category_id: string | null
          category_type: string
          cost_date: string
          cost_type: string
          created_at: string | null
          description: string | null
          due_day: number | null
          id: string
          installment_number: number | null
          is_active: boolean | null
          is_installment: boolean | null
          name: string
          payment_method: string | null
          total_installments: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          category_id?: string | null
          category_type?: string
          cost_date: string
          cost_type: string
          created_at?: string | null
          description?: string | null
          due_day?: number | null
          id?: string
          installment_number?: number | null
          is_active?: boolean | null
          is_installment?: boolean | null
          name: string
          payment_method?: string | null
          total_installments?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          category_type?: string
          cost_date?: string
          cost_type?: string
          created_at?: string | null
          description?: string | null
          due_day?: number | null
          id?: string
          installment_number?: number | null
          is_active?: boolean | null
          is_installment?: boolean | null
          name?: string
          payment_method?: string | null
          total_installments?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_costs_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "personal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_costs_history: {
        Row: {
          amount: number
          category_id: string | null
          category_type: string
          change_type: string
          changed_at: string
          cost_date: string
          cost_id: string
          cost_type: string
          due_day: number | null
          id: string
          name: string
          new_values: Json | null
          old_values: Json | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          category_id?: string | null
          category_type?: string
          change_type: string
          changed_at?: string
          cost_date: string
          cost_id: string
          cost_type: string
          due_day?: number | null
          id?: string
          name: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          category_type?: string
          change_type?: string
          changed_at?: string
          cost_date?: string
          cost_id?: string
          cost_type?: string
          due_day?: number | null
          id?: string
          name?: string
          new_values?: Json | null
          old_values?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      personal_credit_cards: {
        Row: {
          available_limit: number | null
          category_type: string
          created_at: string | null
          credit_limit: number | null
          current_invoice: number
          id: string
          institution: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          available_limit?: number | null
          category_type?: string
          created_at?: string | null
          credit_limit?: number | null
          current_invoice?: number
          id?: string
          institution: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          available_limit?: number | null
          category_type?: string
          created_at?: string | null
          credit_limit?: number | null
          current_invoice?: number
          id?: string
          institution?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      personal_debt_achievements: {
        Row: {
          achieved_at: string | null
          achievement_name: string
          achievement_type: string
          category_type: string
          created_at: string | null
          debt_id: string | null
          id: string
          user_id: string | null
          value_achieved: number | null
        }
        Insert: {
          achieved_at?: string | null
          achievement_name: string
          achievement_type: string
          category_type?: string
          created_at?: string | null
          debt_id?: string | null
          id?: string
          user_id?: string | null
          value_achieved?: number | null
        }
        Update: {
          achieved_at?: string | null
          achievement_name?: string
          achievement_type?: string
          category_type?: string
          created_at?: string | null
          debt_id?: string | null
          id?: string
          user_id?: string | null
          value_achieved?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_debt_achievements_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "personal_debts"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_debt_payments: {
        Row: {
          created_at: string | null
          data_pagamento: string
          debt_id: string
          id: string
          saldo_apos_pagamento: number
          user_id: string | null
          valor_pago: number
        }
        Insert: {
          created_at?: string | null
          data_pagamento: string
          debt_id: string
          id?: string
          saldo_apos_pagamento: number
          user_id?: string | null
          valor_pago: number
        }
        Update: {
          created_at?: string | null
          data_pagamento?: string
          debt_id?: string
          id?: string
          saldo_apos_pagamento?: number
          user_id?: string | null
          valor_pago?: number
        }
        Relationships: [
          {
            foreignKeyName: "personal_debt_payments_debt_id_fkey"
            columns: ["debt_id"]
            isOneToOne: false
            referencedRelation: "personal_debts"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_debts: {
        Row: {
          aporte_mensal: number
          category_type: string
          created_at: string | null
          id: string
          juros_mensal: number
          nome: string
          pagamento_minimo: number | null
          saldo_atual: number
          status: string
          tipo: string
          updated_at: string | null
          user_id: string | null
          valor_total: number
        }
        Insert: {
          aporte_mensal: number
          category_type?: string
          created_at?: string | null
          id?: string
          juros_mensal?: number
          nome: string
          pagamento_minimo?: number | null
          saldo_atual: number
          status?: string
          tipo: string
          updated_at?: string | null
          user_id?: string | null
          valor_total: number
        }
        Update: {
          aporte_mensal?: number
          category_type?: string
          created_at?: string | null
          id?: string
          juros_mensal?: number
          nome?: string
          pagamento_minimo?: number | null
          saldo_atual?: number
          status?: string
          tipo?: string
          updated_at?: string | null
          user_id?: string | null
          valor_total?: number
        }
        Relationships: []
      }
      personal_families: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      personal_family_members: {
        Row: {
          created_at: string | null
          email: string | null
          family_id: string
          id: string
          name: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          family_id: string
          id?: string
          name: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          family_id?: string
          id?: string
          name?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_family_members_family_id_fkey"
            columns: ["family_id"]
            isOneToOne: false
            referencedRelation: "personal_families"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_goals: {
        Row: {
          category_type: string
          created_at: string | null
          current_amount: number
          goal_category: string | null
          goal_type: string
          id: string
          is_active: boolean | null
          linked_debt_id: string | null
          name: string
          target_amount: number
          target_date: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category_type?: string
          created_at?: string | null
          current_amount?: number
          goal_category?: string | null
          goal_type: string
          id?: string
          is_active?: boolean | null
          linked_debt_id?: string | null
          name: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category_type?: string
          created_at?: string | null
          current_amount?: number
          goal_category?: string | null
          goal_type?: string
          id?: string
          is_active?: boolean | null
          linked_debt_id?: string | null
          name?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_goals_linked_debt_id_fkey"
            columns: ["linked_debt_id"]
            isOneToOne: false
            referencedRelation: "personal_debts"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_goals_history: {
        Row: {
          created_at: string | null
          current_amount: number
          goal_id: string
          id: string
          recorded_at: string
          target_amount: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          current_amount?: number
          goal_id: string
          id?: string
          recorded_at?: string
          target_amount?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          current_amount?: number
          goal_id?: string
          id?: string
          recorded_at?: string
          target_amount?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_goals_history_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "personal_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_investment_contributions: {
        Row: {
          amount: number
          contribution_date: string
          created_at: string | null
          id: string
          investment_id: string
          notes: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          contribution_date: string
          created_at?: string | null
          id?: string
          investment_id: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          contribution_date?: string
          created_at?: string | null
          id?: string
          investment_id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_investment_contributions_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "personal_investments"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_investment_returns: {
        Row: {
          created_at: string | null
          id: string
          investment_id: string | null
          notes: string | null
          return_month: string
          return_percentage: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          investment_id?: string | null
          notes?: string | null
          return_month: string
          return_percentage?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          investment_id?: string | null
          notes?: string | null
          return_month?: string
          return_percentage?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_investment_returns_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "personal_investments"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_investment_withdrawals: {
        Row: {
          amount: number
          created_at: string | null
          id: string
          investment_id: string
          notes: string | null
          updated_at: string | null
          user_id: string | null
          withdrawal_date: string
        }
        Insert: {
          amount?: number
          created_at?: string | null
          id?: string
          investment_id: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
          withdrawal_date: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          id?: string
          investment_id?: string
          notes?: string | null
          updated_at?: string | null
          user_id?: string | null
          withdrawal_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "personal_investment_withdrawals_investment_id_fkey"
            columns: ["investment_id"]
            isOneToOne: false
            referencedRelation: "personal_investments"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_investments: {
        Row: {
          asset_type: string | null
          average_price: number | null
          category_type: string
          contracted_rate: number | null
          created_at: string | null
          currency: string | null
          current_amount: number
          current_price: number | null
          current_price_brl: number | null
          exchange: string | null
          fund_cnpj: string | null
          fund_type: string | null
          id: string
          indexer: string | null
          initial_amount: number
          investment_class: string
          investment_date: string
          is_active: boolean | null
          issuer: string | null
          last_price_update: string | null
          liquidity: string | null
          maturity_date: string | null
          name: string
          product_type: string | null
          purchase_price: number | null
          quantity: number | null
          ticker: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          asset_type?: string | null
          average_price?: number | null
          category_type?: string
          contracted_rate?: number | null
          created_at?: string | null
          currency?: string | null
          current_amount?: number
          current_price?: number | null
          current_price_brl?: number | null
          exchange?: string | null
          fund_cnpj?: string | null
          fund_type?: string | null
          id?: string
          indexer?: string | null
          initial_amount?: number
          investment_class: string
          investment_date: string
          is_active?: boolean | null
          issuer?: string | null
          last_price_update?: string | null
          liquidity?: string | null
          maturity_date?: string | null
          name: string
          product_type?: string | null
          purchase_price?: number | null
          quantity?: number | null
          ticker?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          asset_type?: string | null
          average_price?: number | null
          category_type?: string
          contracted_rate?: number | null
          created_at?: string | null
          currency?: string | null
          current_amount?: number
          current_price?: number | null
          current_price_brl?: number | null
          exchange?: string | null
          fund_cnpj?: string | null
          fund_type?: string | null
          id?: string
          indexer?: string | null
          initial_amount?: number
          investment_class?: string
          investment_date?: string
          is_active?: boolean | null
          issuer?: string | null
          last_price_update?: string | null
          liquidity?: string | null
          maturity_date?: string | null
          name?: string
          product_type?: string | null
          purchase_price?: number | null
          quantity?: number | null
          ticker?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      personal_revenues: {
        Row: {
          amount: number
          category_id: string | null
          category_type: string
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          payment_method: string | null
          receipt_date: string
          revenue_type: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number
          category_id?: string | null
          category_type?: string
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          payment_method?: string | null
          receipt_date: string
          revenue_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          category_type?: string
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          payment_method?: string | null
          receipt_date?: string
          revenue_type?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "personal_revenues_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "personal_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_settings: {
        Row: {
          category_type: string
          created_at: string | null
          id: string
          initial_patrimony: number
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category_type?: string
          created_at?: string | null
          id?: string
          initial_patrimony?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category_type?: string
          created_at?: string | null
          id?: string
          initial_patrimony?: number
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      personal_subscriptions: {
        Row: {
          billing_day: number
          category_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          monthly_amount: number
          name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          billing_day: number
          category_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          monthly_amount?: number
          name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          billing_day?: number
          category_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          monthly_amount?: number
          name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      personal_subscriptions_history: {
        Row: {
          billing_day: number
          category_type: string
          change_type: string
          changed_at: string
          id: string
          monthly_amount: number
          name: string
          new_values: Json | null
          old_values: Json | null
          subscription_id: string
          user_id: string | null
        }
        Insert: {
          billing_day: number
          category_type?: string
          change_type: string
          changed_at?: string
          id?: string
          monthly_amount?: number
          name: string
          new_values?: Json | null
          old_values?: Json | null
          subscription_id: string
          user_id?: string | null
        }
        Update: {
          billing_day?: number
          category_type?: string
          change_type?: string
          changed_at?: string
          id?: string
          monthly_amount?: number
          name?: string
          new_values?: Json | null
          old_values?: Json | null
          subscription_id?: string
          user_id?: string | null
        }
        Relationships: []
      }
      propostas: {
        Row: {
          analise: Json
          carteira: Json
          cliente_nome: string
          comparativo: Json
          created_at: string
          created_by: string | null
          data_proposta: string
          id: string
          investimento_nota: string | null
          numero: string
          plano_destaque: string | null
          slug: string
          updated_at: string
        }
        Insert: {
          analise?: Json
          carteira?: Json
          cliente_nome: string
          comparativo?: Json
          created_at?: string
          created_by?: string | null
          data_proposta: string
          id?: string
          investimento_nota?: string | null
          numero: string
          plano_destaque?: string | null
          slug: string
          updated_at?: string
        }
        Update: {
          analise?: Json
          carteira?: Json
          cliente_nome?: string
          comparativo?: Json
          created_at?: string
          created_by?: string | null
          data_proposta?: string
          id?: string
          investimento_nota?: string | null
          numero?: string
          plano_destaque?: string | null
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      quiz_diagnostico_estrategico: {
        Row: {
          base_carteira: string | null
          bloqueio_carteira: string | null
          checkout_canal: string | null
          checkout_cliques: number
          checkout_iniciado_em: string | null
          compromisso: string | null
          controle_financas: string | null
          created_at: string
          crescimento_patrimonio: string | null
          email: string
          escolha_investimentos: string | null
          estado_civil: string | null
          experiencia_assessor: string | null
          id: string
          idade: string | null
          investimento_mensal: string | null
          motivo_sessao: string | null
          nome: string
          objetivo: string | null
          pagamento_em: string | null
          pagamento_external_id: string | null
          pagamento_moeda: string | null
          pagamento_status: string
          pagamento_valor: number | null
          page_views: number | null
          pain_point: string | null
          plano_aposentadoria: string | null
          prazo_melhorias: string | null
          problema_resolver: string | null
          proposta_consultoria: string | null
          quiz_completed_at: string | null
          quiz_started_at: string | null
          reentradas: number
          respostas_quiz: Json | null
          situacao_atual: string | null
          status: string
          status_anterior: string | null
          telefone: string
          updated_at: string
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          valor_investido: string | null
          video_percentual: number | null
        }
        Insert: {
          base_carteira?: string | null
          bloqueio_carteira?: string | null
          checkout_canal?: string | null
          checkout_cliques?: number
          checkout_iniciado_em?: string | null
          compromisso?: string | null
          controle_financas?: string | null
          created_at?: string
          crescimento_patrimonio?: string | null
          email: string
          escolha_investimentos?: string | null
          estado_civil?: string | null
          experiencia_assessor?: string | null
          id?: string
          idade?: string | null
          investimento_mensal?: string | null
          motivo_sessao?: string | null
          nome: string
          objetivo?: string | null
          pagamento_em?: string | null
          pagamento_external_id?: string | null
          pagamento_moeda?: string | null
          pagamento_status?: string
          pagamento_valor?: number | null
          page_views?: number | null
          pain_point?: string | null
          plano_aposentadoria?: string | null
          prazo_melhorias?: string | null
          problema_resolver?: string | null
          proposta_consultoria?: string | null
          quiz_completed_at?: string | null
          quiz_started_at?: string | null
          reentradas?: number
          respostas_quiz?: Json | null
          situacao_atual?: string | null
          status?: string
          status_anterior?: string | null
          telefone: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor_investido?: string | null
          video_percentual?: number | null
        }
        Update: {
          base_carteira?: string | null
          bloqueio_carteira?: string | null
          checkout_canal?: string | null
          checkout_cliques?: number
          checkout_iniciado_em?: string | null
          compromisso?: string | null
          controle_financas?: string | null
          created_at?: string
          crescimento_patrimonio?: string | null
          email?: string
          escolha_investimentos?: string | null
          estado_civil?: string | null
          experiencia_assessor?: string | null
          id?: string
          idade?: string | null
          investimento_mensal?: string | null
          motivo_sessao?: string | null
          nome?: string
          objetivo?: string | null
          pagamento_em?: string | null
          pagamento_external_id?: string | null
          pagamento_moeda?: string | null
          pagamento_status?: string
          pagamento_valor?: number | null
          page_views?: number | null
          pain_point?: string | null
          plano_aposentadoria?: string | null
          prazo_melhorias?: string | null
          problema_resolver?: string | null
          proposta_consultoria?: string | null
          quiz_completed_at?: string | null
          quiz_started_at?: string | null
          reentradas?: number
          respostas_quiz?: Json | null
          situacao_atual?: string | null
          status?: string
          status_anterior?: string | null
          telefone?: string
          updated_at?: string
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          valor_investido?: string | null
          video_percentual?: number | null
        }
        Relationships: []
      }
      stock_analysis: {
        Row: {
          action: string | null
          cagr_5_anos: number
          created_at: string
          exchange: string
          id: string
          lpa: number
          lpa_futuro_5_anos: number | null
          margem_seguranca: number
          pl_medio_5_anos: number | null
          preco_atual: number | null
          preco_atual_updated_at: string | null
          preco_justo: number | null
          preco_justo_com_margem: number | null
          setor: string | null
          taxa_livre_risco: number
          ticker: string
          updated_at: string
        }
        Insert: {
          action?: string | null
          cagr_5_anos: number
          created_at?: string
          exchange?: string
          id?: string
          lpa: number
          lpa_futuro_5_anos?: number | null
          margem_seguranca?: number
          pl_medio_5_anos?: number | null
          preco_atual?: number | null
          preco_atual_updated_at?: string | null
          preco_justo?: number | null
          preco_justo_com_margem?: number | null
          setor?: string | null
          taxa_livre_risco?: number
          ticker: string
          updated_at?: string
        }
        Update: {
          action?: string | null
          cagr_5_anos?: number
          created_at?: string
          exchange?: string
          id?: string
          lpa?: number
          lpa_futuro_5_anos?: number | null
          margem_seguranca?: number
          pl_medio_5_anos?: number | null
          preco_atual?: number | null
          preco_atual_updated_at?: string | null
          preco_justo?: number | null
          preco_justo_com_margem?: number | null
          setor?: string | null
          taxa_livre_risco?: number
          ticker?: string
          updated_at?: string
        }
        Relationships: []
      }
      suppliers: {
        Row: {
          address: string | null
          created_at: string | null
          document: string | null
          email: string | null
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          document?: string | null
          email?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      transaction_categories: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_fixed: boolean | null
          name: string
          parent_id: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_fixed?: boolean | null
          name: string
          parent_id?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_fixed?: boolean | null
          name?: string
          parent_id?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transaction_categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "transaction_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stripe_subscriptions: {
        Row: {
          created_at: string | null
          id: string
          stripe_customer_id: string | null
          stripe_product_id: string | null
          stripe_subscription_id: string | null
          subscription_end: string | null
          subscription_status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          stripe_customer_id?: string | null
          stripe_product_id?: string | null
          stripe_subscription_id?: string | null
          subscription_end?: string | null
          subscription_status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wealth_clients: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      wealth_holdings: {
        Row: {
          avg_price: number | null
          client_id: string
          created_at: string
          id: string
          name: string | null
          position: number
          quantity: number | null
          sector: string | null
          ticker: string
          updated_at: string
          weight: number
        }
        Insert: {
          avg_price?: number | null
          client_id: string
          created_at?: string
          id?: string
          name?: string | null
          position?: number
          quantity?: number | null
          sector?: string | null
          ticker: string
          updated_at?: string
          weight?: number
        }
        Update: {
          avg_price?: number | null
          client_id?: string
          created_at?: string
          id?: string
          name?: string | null
          position?: number
          quantity?: number | null
          sector?: string | null
          ticker?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "wealth_holdings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "wealth_clients"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_access_page: {
        Args: { _page: string; _user_id: string }
        Returns: boolean
      }
      can_access_personal_finance: {
        Args: { _user_id: string }
        Returns: boolean
      }
      create_default_categories_for_user: {
        Args: { p_category_type?: string; p_user_id: string }
        Returns: undefined
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user" | "subscriber"
      installment_status: "pago" | "pendente" | "atrasado" | "cancelado"
      payment_status: "pago" | "pendente" | "atrasado" | "cancelado"
      transaction_type: "receita" | "despesa"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user", "subscriber"],
      installment_status: ["pago", "pendente", "atrasado", "cancelado"],
      payment_status: ["pago", "pendente", "atrasado", "cancelado"],
      transaction_type: ["receita", "despesa"],
    },
  },
} as const

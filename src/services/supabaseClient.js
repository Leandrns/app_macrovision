// src/services/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Substitua estas variáveis pelas suas credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Funções para manipular análises
export const analysisService = {
  // Criar nova análise
  async createAnalysis(analysisData) {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .insert([analysisData])
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Erro ao criar análise:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar todas as análises
  async getAllAnalyses() {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .order('analysis_date', { ascending: false })
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar análises:', error)
      return { success: false, error: error.message }
    }
  },

  // Buscar análise por ID
  async getAnalysisById(id) {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar análise:', error)
      return { success: false, error: error.message }
    }
  },

  // Atualizar análise
  async updateAnalysis(id, updates) {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .update(updates)
        .eq('id', id)
        .select()
      
      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Erro ao atualizar análise:', error)
      return { success: false, error: error.message }
    }
  },

  // Deletar análise
  async deleteAnalysis(id) {
    try {
      const { error } = await supabase
        .from('analyses')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Erro ao deletar análise:', error)
      return { success: false, error: error.message }
    }
  },

  // Filtrar análises
  async filterAnalyses(filters) {
    try {
      let query = supabase.from('analyses').select('*')
      
      if (filters.date) {
        query = query.eq('analysis_date', filters.date)
      }
      
      if (filters.patient) {
        query = query.ilike('patient_name', `%${filters.patient}%`)
      }
      
      if (filters.analysisType) {
        query = query.eq('analysis_type', filters.analysisType)
      }
      
      query = query.order('analysis_date', { ascending: false })
      
      const { data, error } = await query
      
      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao filtrar análises:', error)
      return { success: false, error: error.message }
    }
  }
}
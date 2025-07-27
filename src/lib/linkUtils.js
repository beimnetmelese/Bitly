import { supabase } from './supabase';

// Generate random short code
export const generateRandomShortCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Validate custom short code
export const validateCustomShortCode = (shortCode) => {
  // Only allow alphanumeric characters and hyphens
  const regex = /^[a-zA-Z0-9-]+$/;
  if (!regex.test(shortCode)) {
    return { valid: false, error: 'Short code can only contain letters, numbers, and hyphens' };
  }
  
  if (shortCode.length < 3) {
    return { valid: false, error: 'Short code must be at least 3 characters long' };
  }
  
  if (shortCode.length > 20) {
    return { valid: false, error: 'Short code must be less than 20 characters long' };
  }
  
  return { valid: true, error: null };
};

// Check if short code is available
export const isShortCodeAvailable = async (shortCode) => {
  const { data, error } = await supabase
    .from('links')
    .select('id')
    .eq('short_code', shortCode)
    .single();
  
  if (error && error.code === 'PGRST116') {
    // No rows returned, short code is available
    return true;
  }
  
  return false;
};

// Generate unique short code
export const generateUniqueShortCode = async (customCode = null) => {
  if (customCode) {
    const validation = validateCustomShortCode(customCode);
    if (!validation.valid) {
      throw new Error(validation.error);
    }
    
    const isAvailable = await isShortCodeAvailable(customCode);
    if (!isAvailable) {
      throw new Error('This short code is already taken');
    }
    
    return customCode;
  }
  
  // Generate random code
  let attempts = 0;
  const maxAttempts = 10;
  
  while (attempts < maxAttempts) {
    const shortCode = generateRandomShortCode();
    const isAvailable = await isShortCodeAvailable(shortCode);
    
    if (isAvailable) {
      return shortCode;
    }
    
    attempts++;
  }
  
  throw new Error('Unable to generate unique short code. Please try again.');
};

// Validate URL
export const validateURL = (url) => {
  try {
    // Add protocol if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    new URL(url);
    return { valid: true, url, error: null };
  } catch {
    return { valid: false, url: null, error: 'Please enter a valid URL' };
  }
};

// Link management API
export const linkAPI = {
  // Create new link
  createLink: async (originalUrl, customShortCode = null, userId) => {
    try {
      // Validate URL
      const urlValidation = validateURL(originalUrl);
      if (!urlValidation.valid) {
        throw new Error(urlValidation.error);
      }
      
      // Generate unique short code
      const shortCode = await generateUniqueShortCode(customShortCode);
      
      // Create link in database - temporarily remove user_id to avoid foreign key constraint
      const linkData = {
        original_url: urlValidation.url,
        short_code: shortCode,
        click_count: 0,
        created_at: new Date().toISOString()
      };

      // Temporarily comment out user_id to avoid foreign key constraint issues
      // if (userId) {
      //   linkData.user_id = userId;
      // }

      const { data, error } = await supabase
        .from('links')
        .insert([linkData])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Get user's links (temporarily get all links since user_id is disabled)
  getUserLinks: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('links')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  },

  // Delete link (temporarily remove user_id filter)
  deleteLink: async (linkId, userId) => {
    try {
      const { error } = await supabase
        .from('links')
        .delete()
        .eq('id', linkId);

      if (error) throw error;

      return { error: null };
    } catch (error) {
      return { error };
    }
  },

  // Update link
  updateLink: async (linkId, updates, userId) => {
    try {
      let query = supabase
        .from('links')
        .update(updates)
        .eq('id', linkId);

      // Only filter by user_id if provided
      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query
        .select()
        .single();

      if (error) throw error;

      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }
};
